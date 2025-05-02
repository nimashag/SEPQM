import { test, expect, request } from "@playwright/test";
import { getUserToken } from "../../utils/auth";

test.describe("Restaurant API", () => {
  let token: string;
  let apiContext: any;
  let restaurantId: string;

  test.beforeAll(async () => {
    token = await getUserToken();
    apiContext = await request.newContext({
      baseURL: "http://localhost:3001",
      extraHTTPHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  });

  test("Create a restaurant", async () => {
    const res = await apiContext.post("/api/restaurants", {
      data: {
        name: "Test Bistro",
        address: "123 Food Lane",
        location: "Downtown",
      },
    });
    console.log("Final URL:", res.url());
    console.log("Create status:", res.status());
    console.log("Create body:", await res.text());

    expect(res.ok()).toBeTruthy();
    const data = await res.json();
    expect(data.name).toBe("Test Bistro");
    restaurantId = data._id;
  });

  test("Get all restaurants", async () => {
    const res = await apiContext.get("/api/restaurants");

    console.log("Final URL:", res.url());
    console.log("Create status:", res.status());
    console.log("Create body:", await res.text());

    expect(res.ok()).toBeTruthy();
    const restaurants = await res.json();
    expect(Array.isArray(restaurants)).toBe(true);
  });

  test("Get one restaurant by ID", async () => {
    const res = await apiContext.get(`/api/restaurants/${restaurantId}`);

    console.log("Get One status:", res.status());
    console.log("Get One body:", await res.text());

    expect(res.ok()).toBeTruthy();
    const restaurant = await res.json();
    expect(restaurant._id).toBe(restaurantId);
    expect(restaurant.name).toBe("Test Bistro");
  });

  test("Update restaurant", async () => {
    const res = await apiContext.put(`/api/restaurants/${restaurantId}`, {
      data: {
        name: "Updated Bistro",
        address: "456 New Lane",
        location: "Uptown",
      },
    });

    console.log("Update status:", res.status());
    console.log("Update body:", await res.text());

    expect(res.ok()).toBeTruthy();
    const updated = await res.json();
    expect(updated.name).toBe("Updated Bistro");
  });

  test("Delete restaurant", async () => {
    const res = await apiContext.delete(`/api/restaurants/${restaurantId}`);

    console.log("Delete status:", res.status());
    console.log("Delete body:", await res.text());

    expect(res.status()).toBe(204); // No content
  });

  // 🔒 Unauthorized Access Tests

  test("Fail to create restaurant without token", async () => {
    const unauthContext = await request.newContext({
      baseURL: "http://localhost:3001",
    });

    const res = await unauthContext.post("/api/restaurants", {
      data: {
        name: "NoAuth Bistro",
        address: "123 NoAuth",
        location: "Nowhere",
      },
    });

    expect(res.status()).toBe(401); // Unauthorized
  });

  test("Fail to update restaurant without token", async () => {
    const unauthContext = await request.newContext({
      baseURL: "http://localhost:3001",
    });

    const res = await unauthContext.put(`/api/restaurants/${restaurantId}`, {
      data: {
        name: "Hacker Bistro",
      },
    });

    expect(res.status()).toBe(401); // Unauthorized
  });

  test("Fail to delete restaurant without token", async () => {
    const unauthContext = await request.newContext({
      baseURL: "http://localhost:3001",
    });

    const res = await unauthContext.delete(`/api/restaurants/${restaurantId}`);
    expect(res.status()).toBe(401); // Unauthorized
  });

  
});
