import { useState, useEffect } from 'react';
import axios from 'axios';
import debounce from 'lodash.debounce';

const AddressInput = ({ label, value, setValue, setError }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [isInputComplete, setIsInputComplete] = useState(false);

  // Hàm gọi API backend (proxy) để lấy gợi ý địa chỉ
  const fetchSuggestions = debounce(async (query) => {
    if (!query || query.length < 3 || isInputComplete) return; // Không gọi API nếu input quá ngắn hoặc đã hoàn thành

    try {
      const res = await axios.get("http://localhost:5000/api/search", {
        params: { q: query },  // Gửi query vào backend
      });
      
      if (res.data && Array.isArray(res.data.features)) {
        setSuggestions(res.data.features); // Lấy danh sách gợi ý địa chỉ từ Geoapify
      } else {
        setError("Không tìm thấy kết quả gợi ý.");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Không thể tìm kiếm địa chỉ.");
    }
  }, 500);  // Thêm debounce để hạn chế gọi API quá nhiều lần

  useEffect(() => {
    if (value.length >= 3 && !isInputComplete) {
      fetchSuggestions(value);  // Gọi API khi giá trị input đủ dài
    } else {
      setSuggestions([]);
    }
  }, [value]);  // Mỗi khi giá trị input thay đổi, gọi lại API

  const handleSelect = (display_name) => {
    setValue(display_name);
    setSuggestions([]);
    setIsInputComplete(true); // Đánh dấu đã hoàn thành địa chỉ
  };

  const handleChange = (e) => {
    setValue(e.target.value);
    setSuggestions([]);
    setIsInputComplete(false); // Đặt lại trạng thái khi người dùng chỉnh sửa
  };

  return (
    <div>
      <label>{label}</label>
      <input
        value={value}
        onChange={handleChange}  // Khi người dùng thay đổi giá trị, gọi handleChange
        placeholder="Nhập địa chỉ..."
        style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
      />
      {/* Hiển thị gợi ý địa chỉ nếu có */}
      {suggestions.length > 0 && !isInputComplete && (
        <ul style={{ border: "1px solid #ccc", listStyle: "none", padding: 0, marginTop: '5px' }}>
          {suggestions.map((s, i) => (
            <li
              key={i}
              style={{ padding: "8px", cursor: "pointer" }}
              onClick={() => handleSelect(s.properties.formatted)}  // Khi người dùng chọn gợi ý, gọi handleSelect
            >
              {s.properties.formatted}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AddressInput;
