import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import AdminLayout from "./RestaurantAdminLayout";
import Swal from "sweetalert2";
import { restaurantUrl } from "../../../api";

const EditRestaurant: React.FC = () => {
  const [form, setForm] = useState({
    name: "",
    address: "",
    location: "",
    available: false,
    image: null as File | null,
  });
  const [errors, setErrors] = useState({
    name: "",
    address: "",
    location: "",
  });
  

  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const validateForm = () => {
    const newErrors = {
      name: form.name.trim() ? "" : "Restaurant name is required.",
      address: form.address.trim() ? "" : "Address is required.",
      location: form.location.trim() ? "" : "Location is required.",
    };
  
    setErrors(newErrors);
  
    return Object.values(newErrors).every((error) => error === "");
  };
  

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const res = await axios.get(`${restaurantUrl}/api/restaurants/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const restaurant = res.data;
        setForm({
          name: restaurant.name,
          address: restaurant.address,
          location: restaurant.location,
          available: restaurant.available,
          image: null,
        });
      } catch (err) {
        console.error("Fetch failed:", err);
      }
    };

    fetchRestaurant();
  }, [id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    if (name === "image" && files) {
      setForm((prev) => ({ ...prev, image: files[0] }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, available: e.target.checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    if (!validateForm()) {
      Swal.fire("Validation Error", "Please fill in all required fields correctly.", "warning");
      return;
    }

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("address", form.address);
    formData.append("location", form.location);
    formData.append("available", String(form.available));
    if (form.image) {
      formData.append("image", form.image);
    }

    try {
      await axios.put(`${restaurantUrl}/api/restaurants/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      Swal.fire("Success!", "Restaurant updated successfully!", "success");
      navigate("/restaurant-dash");
    } catch (err) {
      console.error("Update failed:", err);
      Swal.fire("Error", "Failed to update restaurant.", "error");
    }
  };

  return (
    <AdminLayout>
      <div className="p-6 font-['Inter'] text-gray-800 dark:text-gray-100">
        <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-md p-8">
          <h1 className="text-3xl font-bold mb-6 text-center">
            Edit Restaurant
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Restaurant Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleInputChange}
                className="w-full border rounded-md p-2 dark:bg-gray-700"
                required
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Address</label>
              <input
                type="text"
                name="address"
                value={form.address}
                onChange={handleInputChange}
                className="w-full border rounded-md p-2 dark:bg-gray-700"
                required
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Location (City)</label>
              <input
                type="text"
                name="location"
                value={form.location}
                onChange={handleInputChange}
                className="w-full border rounded-md p-2 dark:bg-gray-700"
                required
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.available}
                onChange={handleCheckboxChange}
                className="accent-blue-500 w-5 h-5"
              />
              <label className="text-sm font-medium">Available</label>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Upload New Image (optional)</label>
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleInputChange}
                className="w-full text-sm text-gray-600 dark:text-gray-400"
              />
            </div>

            <div className="flex justify-end gap-3 pt-6">
              <button
                type="button"
                onClick={() => navigate("/restaurant-dash")}
                className="px-5 py-2 rounded-full bg-red-500 hover:bg-red-800 text-white text-sm font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-full bg-green-600 hover:bg-green-700 text-white text-sm font-semibold"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
};

export default EditRestaurant;
