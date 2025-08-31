"use client"

import { useState } from "react"
import { Users, BookOpen, MessageSquare, LogOut } from "lucide-react"
import { faCircleUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from 'next/navigation';

const instructorMenuItems = [
  {
    id: "students",
    label: "Manage Students",
    icon: Users,
    href: "instructor/manageStudents",
  },
  {
    id: "lessons",
    label: "Manage Lessons",
    icon: BookOpen,
    href: "instructor/manageLessons",
  },
  {
    id: "message",
    label: "Message",
    icon: MessageSquare,
    href: "instructor/message",
  },
]

const studentMenuItems = [
  {
    id: "courses",
    label: "My Courses",
    icon: BookOpen,
    href: "student/manageLessons",
  },
  {
    id: "message",
    label: "Message",
    icon: MessageSquare,
    href: "student/message",
  },
]

interface LeftMenuProps {
  role: "student" | "instructor";
}

export function LeftMenu({ role }: LeftMenuProps) {
  const router = useRouter();
  const [activeItem, setActiveItem] = useState("students")

  return (
    <div className="w-60 bg-gray-50 border-r border-gray-200 flex flex-col h-screen">
      <div className="p-6">
        <h1 className="text-3xl font-bold text-center">Classroom Management</h1>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        { role === "instructor" ? instructorMenuItems.map((item) => {
          const Icon = item.icon
          const isActive = activeItem === item.id

          return (
            <button
              key={item.id}
              onClick={() => setActiveItem(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg transition-colors ${
                isActive ? "bg-blue-50 text-blue-600 border-r-2 border-blue-600" : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          )
        }) : studentMenuItems.map((item) => {
          const Icon = item.icon
          const isActive = activeItem === item.id

          return (
            <button
              key={item.id}
              onClick={() => setActiveItem(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg transition-colors ${
                isActive ? "bg-blue-50 text-blue-600 border-r-2 border-blue-600" : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          )
        })}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 flex items-center justify-center">
            <FontAwesomeIcon icon={faCircleUser} style={{ width: '100%', height: '100%' }}/>
          </div>
          <button 
            className="cursor-pointer text-gray-600 hover:text-red-600 hover:bg-red-50 flex items-center"
            onClick={() => {
              localStorage.removeItem('user-data');
              localStorage.removeItem('user-token');
              localStorage.removeItem('role');
              router.push('/');
            }}
          >
            <LogOut className="w-4 h-4 mr-2" />
            <span>Log out</span>
          </button>
        </div>
      </div>
    </div>
  )
}
