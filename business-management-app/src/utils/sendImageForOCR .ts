import axios from 'axios';

const API_BASE_URL = "https://2cb4ee45a658.ngrok-free.app";

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
