import { useState } from "react";
import axios from "axios";

// 환경 변수 사용 (없으면 기본값 사용)
const API_BASE = import.meta.env.VITE_API_BASE || "http://app.frodo.kr:5000";

function Login({ onSuccess }) {
  const [form, setForm] = useState({ username: "", password: "" });
  const [message, setMessage] = useState("");

  const handleLogin = async () => {
    try {
      const res = await axios.post(`${API_BASE}/api/login`, form);
      setMessage(`로그인 성공: ${res.data.username}`);
      onSuccess(res.data.username);  // ✅ 부모 컴포넌트(App)로 로그인 성공 알림
    } catch (err) {
      if (err.response?.status === 401) {
        setMessage("로그인 실패: 아이디 또는 비밀번호가 틀렸습니다.");
      } else {
        setMessage("서버 오류가 발생했습니다.");
      }
    }
  };

  return (
    <div>
      <h2>로그인</h2>
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
      <button onClick={handleLogin}>로그인</button>
      <p>{message}</p>
    </div>
  );
}

export default Login;

