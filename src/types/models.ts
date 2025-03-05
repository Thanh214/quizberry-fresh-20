// Update User type to include email
export interface User {
  id: string;
  username: string;
  email?: string;
  role: "admin" | "student" | "teacher";
  name?: string;
  faculty?: string;
  className?: string;
  studentId?: string;
}

// Update Teacher type to include email
export interface Teacher {
  id: string;
  name: string;
  faculty: string;
  username: string;
  email?: string;
  password?: string;
  createdAt?: string;
}
