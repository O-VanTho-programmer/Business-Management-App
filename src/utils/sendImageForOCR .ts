import axios from 'axios';

const API_BASE_URL = "https://d678c7221be6.ngrok-free.app";

export const sendImageForOCR = async (imageFile: File) => {
    const formData = new FormData();
    formData.append("file", imageFile);

    try {
        const res = await axios.post(`${API_BASE_URL}/ocr`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return res.data;
    } catch (error: any) {
        console.error("OCR API Error:", error);
        throw error;
    }
};
