import React, { useRef, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../redux/authSlice";

function ProfileUpload() {
  const fileRef = useRef(null);
  const dispatch = useDispatch();

  const token =
    useSelector((state) => state.auth.token) || localStorage.getItem("token");

  const user = useSelector((state) => state.auth.user);

  const [uploading, setUploading] = useState(false);

  const handleClick = () => {
    if (!fileRef.current) return;
    fileRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);

      const formData = new FormData();
      formData.append("file", file);

      const res = await axios.post(
        "http://localhost:5000/api/user/upload-profile",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // backend returns profilePic url
      const updatedUser = {
        ...user,
        profile: res.data.profilePic,
      };

      dispatch(setUser(updatedUser));

      alert("Profile photo updated successfully ✅");
    } catch (error) {
      console.log("Profile upload error:", error.response?.data || error.message);
      alert("Profile upload failed ❌");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  return (
    <div className="p-4 border-b flex items-center gap-3">
      {/* Profile Image */}
      <div
        onClick={handleClick}
        className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden cursor-pointer flex items-center justify-center"
      >
        {user?.profile ? (
          <img
            src={user.profile}
            alt="profile"
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-gray-600 font-bold text-lg">
            {user?.fullname?.[0]?.toUpperCase()}
          </span>
        )}
      </div>

      {/* Name + Upload status */}
      <div className="flex flex-col">
        <p className="font-semibold text-gray-800 text-sm">{user?.fullname}</p>

        <p className="text-xs text-gray-500">
          {uploading ? "Uploading..." : "Click to change photo"}
        </p>
      </div>

      {/* Hidden Input */}
      <input
        type="file"
        ref={fileRef}
        hidden
        accept="image/*"
        onChange={handleFileChange}
      />
    </div>
  );
}

export default ProfileUpload;
