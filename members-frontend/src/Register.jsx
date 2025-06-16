import { useState } from "react";
import axios from "axios";

// 환경 변수에서 API 주소 불러오기 (없으면 기본값 사용)
const API_BASE = import.meta.env.VITE_API_BASE || "http://43.203.217.116:5000";

function Register() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [message, setMessage] = useState("");

  const handleRegister = async () => {
    try {
      await axios.post(`${API_BASE}/api/register`, form);
      setMessage("✅ 회원가입 성공! 이제 로그인해주세요.");
    } catch (err) {
      if (err.response?.status === 409) {
        setMessage("❌ 이미 존재하는 사용자입니다.");
      } else {
        setMessage("❌ 회원가입 실패: 서버 오류");
      }
    }
  };

  return (
    <div>
      <h2>회원가입</h2>
      <input
        placeholder="Username"
        value={form.username}
        onChange={(e) => setForm({ ...form, username: e.target.value })}
      />
      <input
        type="password"
        placeholder="Password"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />
      <button onClick={handleRegister}>회원가입</button>
      <p>{message}</p>
    </div>
  );
}

export default Register;

