import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './profile.css';
import anhbia from '../../assets/image/anh_bia.jpg';
import 'bootstrap/dist/css/bootstrap.min.css';

const Profile = () => {
 
  const sampleUser = {
    _id: "123456",
    name: "Đinh Đức Vình",
    email: "vinh@example.com",
    bio: "Tôi là một học sinh yêu thích lập trình và công nghệ.",
    avatar: anhbia,
    class: "12A1",
    phone: "0123456789",
    exerciseCount: 10,
    completedExercises: 8,
    points: 95,
    createdExercises: [
      {
        _id: "ex1",
        title: "Bài tập trắc nghiệm JavaScript",
        description: "Kiểm tra kiến thức cơ bản về JavaScript.",
        type: "multiple-choice",
      },
      {
        _id: "ex2",
        title: "Bài tập tự luận HTML",
        description: "Viết một đoạn mã HTML cơ bản.",
        type: "essay",
      },
    ],
    completedExercisesList: [
      {
        exercise: {
          _id: "ex3",
          title: "Bài tập thực hành CSS",
        },
        score: 9,
        completedAt: "2025-04-01T10:00:00Z",
      },
      {
        exercise: {
          _id: "ex4",
          title: "Bài tập trắc nghiệm React",
        },
        score: 8,
        completedAt: "2025-04-02T15:30:00Z",
      },
    ],
  };

  const [user, setUser] = useState(sampleUser);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    bio: user.bio,
    avatar: user.avatar,
    class: user.class,
    phone: user.phone,
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      avatar: e.target.files[0],
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setUser({
      ...user,
      ...formData,
    });
    setIsEditing(false);
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        {isEditing ? (
          <form onSubmit={handleSubmit} className="profile-form">
            <div className="form-group">
              <label>Tên:</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Email:</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Lớp:</label>
              <input
                type="text"
                name="class"
                value={formData.class}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Số điện thoại:</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Giới thiệu:</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                rows="4"
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="save-btn">
                Lưu thay đổi
              </button>
              <button
                type="button"
                className="cancel-btn"
                onClick={() => setIsEditing(false)}
              >
                Hủy
              </button>
            </div>
          </form>
        ) : (
          <>
            <img
              src={user.avatar}
              alt="Avatar"
              className="profile-avatar"
              onClick={handleFileChange}
            />
            <h1>{user.name}</h1>
            <p className="profile-email">{user.email}</p>
            <p className="profile-class">Lớp: {user.class}</p>
            <p className="profile-phone">Số điện thoại: {user.phone}</p>
            {user.bio && <p className="profile-bio">{user.bio}</p>}

            <div className="profile-stats">
              <div className="stat-item">
                <span className="stat-number">{user.exerciseCount || 0}</span>
                <span className="stat-label">Bài tập</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">
                  {user.completedExercises || 0}
                </span>
                <span className="stat-label">Đã hoàn thành</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{user.points || 0}</span>
                <span className="stat-label">Điểm</span>
              </div>
            </div>

            <button
              className="edit-btn"
              onClick={() => setIsEditing(true)}
            >
              Chỉnh sửa hồ sơ
            </button>
          </>
        )}
      </div>

      <div className="profile-content">
        <div className="profile-section">
          <h2>Bài tập đã giao</h2>
          {user.createdExercises && user.createdExercises.length > 0 ? (
            <div className="exercise-list">
              {user.createdExercises.map((exercise) => (
                <div key={exercise._id} className="exercise-item">
                  <Link to={`/exercise/${exercise._id}`}>
                    <h3>{exercise.title}</h3>
                  </Link>
                  <p>{exercise.description}</p>
                  <span
                    className={`exercise-type ${exercise.type}`}
                  >
                    {exercise.type === "multiple-choice"
                      ? "Trắc nghiệm"
                      : exercise.type === "essay"
                      ? "Tự luận"
                      : "Thực hành"}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p>Chưa tạo bài tập nào.</p>
          )}
        </div>

        <div className="profile-section">
          <h2>Bài tập đã làm</h2>
          {user.completedExercisesList &&
          user.completedExercisesList.length > 0 ? (
            <div className="exercise-list">
              {user.completedExercisesList.map((item) => (
                <div key={item.exercise._id} className="exercise-item">
                  <Link to={`/exercise/${item.exercise._id}`}>
                    <h3>{item.exercise.title}</h3>
                  </Link>
                  <p>Điểm: {item.score || "Chưa chấm"}</p>
                  <p>
                    Ngày hoàn thành:{" "}
                    {new Date(item.completedAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p>Chưa hoàn thành bài tập nào.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;