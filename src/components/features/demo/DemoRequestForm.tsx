"use client";

import React, { useState, useEffect } from "react";
import { useLanguage } from "@/hooks";

interface DemoRequestFormProps {
  origin: string;
}

export default function DemoRequestForm({ origin }: DemoRequestFormProps) {
  const { language } = useLanguage();
  const [form, setForm] = useState({
    company_name: "",
    your_name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!origin) {
      setStatus("Origin prop is required");
    }
  }, [origin]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const { company_name, your_name, email, message } = form;
    if (!company_name || !your_name || !email || !message) {
      setStatus(
        language === "ko"
          ? "모든 필드를 입력해주세요"
          : "Please fill all fields"
      );
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await fetch("/api/request-demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, origin }),
      });
      const data = await res.json();

      if (res.ok) {
        setStatus(
          language === "ko"
            ? "감사합니다! 곧 연락드리겠습니다."
            : "Thank you! We will reach out to you soon."
        );
        setForm({ company_name: "", your_name: "", email: "", message: "" });
      } else {
        setStatus(
          data.error || (language === "ko" ? "제출 실패" : "Submission failed")
        );
      }
    } catch {
      setStatus(language === "ko" ? "네트워크 오류" : "Network error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-lg mx-auto mb-24 flex flex-col gap-6"
    >
      <div className="flex flex-col gap-2">
        <label className="text-white font-medium">
          {language === "ko" ? "회사명" : "Company name"} *
        </label>
        <input
          name="company_name"
          value={form.company_name}
          onChange={handleChange}
          required
          className="bg-[#1c2333] border border-gray-700 rounded-md p-3 text-white"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-white font-medium">
          {language === "ko" ? "이름" : "Your name"} *
        </label>
        <input
          name="your_name"
          value={form.your_name}
          onChange={handleChange}
          required
          className="bg-[#1c2333] border border-gray-700 rounded-md p-3 text-white"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-white font-medium">
          {language === "ko" ? "이메일" : "Email"} *
        </label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          required
          className="bg-[#1c2333] border border-gray-700 rounded-md p-3 text-white"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-white font-medium">
          {language === "ko"
            ? "비즈니스와 직면한 문제에 대해 더 알려주세요"
            : "Tell us more about your business and the problems you're facing"}{" "}
          *
        </label>
        <textarea
          name="message"
          value={form.message}
          onChange={handleChange}
          rows={4}
          required
          className="bg-[#1c2333] border border-gray-700 rounded-md p-3 text-white"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="btn-primary py-3 mt-2 disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {isSubmitting
          ? language === "ko"
            ? "제출 중..."
            : "Submitting..."
          : language === "ko"
          ? "제출하기"
          : "Submit"}
      </button>

      {status && (
        <p
          className={`text-center p-3 rounded ${
            status.includes("감사합니다") || status.includes("Thank you")
              ? "bg-green-900/30 text-green-300"
              : "bg-red-900/30 text-red-300"
          }`}
        >
          {status}
        </p>
      )}
    </form>
  );
}
