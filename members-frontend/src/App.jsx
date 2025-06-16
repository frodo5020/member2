import { useEffect, useState } from "react";
import axios from "axios";
import Login from "./Login";
import Register from "./Register";

// 환경변수 사용 (없으면 기본값)
const API_BASE = import.meta.env.VITE_API_BASE || "http://app.frodo.kr:5000";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [showRegister, setShowRegister] = useState(false); // 🔁 탭 상태
  const [members, setMembers] = useState([]);
  const [search, setSearch] = useState({ id: "", name: "", gender: "", age: "" });
  const [form, setForm] = useState({ id: "", name: "", gender: "", age: "" });
  const [editStates, setEditStates] = useState({});

  const fetchMembers = async () => {
    try {
      const params = Object.fromEntries(Object.entries(search).filter(([_, v]) => v !== ""));
      const res = await axios.get(`${API_BASE}/api/members`, { params });
      setMembers(res.data);

      const initialEdits = {};
      res.data.forEach((m) => {
        initialEdits[m.id] = { name: m.name, gender: m.gender, age: m.age };
      });
      setEditStates(initialEdits);
    } catch (err) {
      alert("데이터 조회 실패");
    }
  };

  const handleCreate = async () => {
    try {
      await axios.post(`${API_BASE}/api/members`, form);
      setForm({ id: "", name: "", gender: "", age: "" });
      fetchMembers();
    } catch (err) {
      alert("생성 실패");
    }
  };

  const handleUpdate = async (id) => {
    try {
      await axios.put(`${API_BASE}/api/members/${id}`, editStates[id]);
      fetchMembers();
    } catch (err) {
      alert("수정 실패");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_BASE}/api/members/${id}`);
      fetchMembers();
    } catch (err) {
      alert("삭제 실패");
    }
  };

  useEffect(() => {
    if (isLoggedIn) fetchMembers();
  }, [isLoggedIn]);

  // 로그인되지 않은 경우: 로그인/회원가입 화면
  if (!isLoggedIn) {
    return (
      <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
        <h1>회원 시스템</h1>

        {/* 로그인 / 회원가입 버튼 탭 */}
        <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
          <button
            onClick={() => setShowRegister(false)}
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: !showRegister ? "#ddd" : "#fff",
              border: "1px solid #ccc",
              fontWeight: !showRegister ? "bold" : "normal",
              cursor: "pointer"
            }}
          >
            로그인
          </button>
          <button
            onClick={() => setShowRegister(true)}
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: showRegister ? "#ddd" : "#fff",
              border: "1px solid #ccc",
              fontWeight: showRegister ? "bold" : "normal",
              cursor: "pointer"
            }}
          >
            회원가입
          </button>
        </div>

        {/* 탭에 따라 다른 컴포넌트 렌더링 */}
        {showRegister ? (
          <Register />
        ) : (
          <Login
            onSuccess={(username) => {
              setUsername(username);
              setIsLoggedIn(true);
            }}
          />
        )}
      </div>
    );
  }

  // 로그인 후: 멤버 관리 화면
  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>👋 {username}님, 환영합니다!</h1>
      <button onClick={() => setIsLoggedIn(false)}>로그아웃</button>

      <h2>회원 검색</h2>
      <div style={{ marginBottom: "1rem" }}>
        <input placeholder="ID" value={search.id} onChange={(e) => setSearch({ ...search, id: e.target.value })} />
        <input placeholder="이름" value={search.name} onChange={(e) => setSearch({ ...search, name: e.target.value })} />
        <input placeholder="성별" value={search.gender} onChange={(e) => setSearch({ ...search, gender: e.target.value })} />
        <input placeholder="나이" value={search.age} onChange={(e) => setSearch({ ...search, age: e.target.value })} />
        <button onClick={fetchMembers}>검색</button>
      </div>

      <h2>회원 등록</h2>
      <div>
        <input placeholder="ID" value={form.id} onChange={(e) => setForm({ ...form, id: e.target.value })} />
        <input placeholder="이름" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input placeholder="성별" value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })} />
        <input placeholder="나이" value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} />
        <button onClick={handleCreate}>등록</button>
      </div>

      <h2>회원 목록</h2>
      <table border="1" cellPadding="5">
        <thead>
          <tr>
            <th>ID</th>
            <th>이름</th>
            <th>성별</th>
            <th>나이</th>
            <th>수정</th>
            <th>삭제</th>
          </tr>
        </thead>
        <tbody>
          {members.map((m) => (
            <tr key={m.id}>
              <td>{m.id}</td>
              <td>
                <input
                  value={editStates[m.id]?.name || ""}
                  onChange={(e) =>
                    setEditStates({ ...editStates, [m.id]: { ...editStates[m.id], name: e.target.value } })
                  }
                />
              </td>
              <td>
                <input
                  value={editStates[m.id]?.gender || ""}
                  onChange={(e) =>
                    setEditStates({ ...editStates, [m.id]: { ...editStates[m.id], gender: e.target.value } })
                  }
                />
              </td>
              <td>
                <input
                  value={editStates[m.id]?.age || ""}
                  onChange={(e) =>
                    setEditStates({ ...editStates, [m.id]: { ...editStates[m.id], age: e.target.value } })
                  }
                />
              </td>
              <td>
                <button onClick={() => handleUpdate(m.id)}>수정</button>
              </td>
              <td>
                <button onClick={() => handleDelete(m.id)}>삭제</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;

