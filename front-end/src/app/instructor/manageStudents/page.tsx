"use client"

import { useEffect, useState } from 'react';
import { authUtils, InstructorData } from '../../../utils/auth';
import { useRouter } from 'next/navigation';

export default function ManageStudentsPage() {
  const router = useRouter();
  const [instructorData, setInstructorData] = useState<InstructorData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check authentication
    if (!authUtils.requireAuth()) {
      router.push('/instructor/login');
      return;
    }

    // Get instructor data
    const data = authUtils.getInstructorData();
    setInstructorData(data);
    setLoading(false);
  }, [router]);

  const handleLogout = () => {
    authUtils.clearAuth();
    router.push('/instructor/login');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Manage Students</h1>
              {instructorData && (
                <p className="text-sm text-gray-600">
                  Xin chào, {instructorData.name} ({instructorData.phone})
                </p>
              )}
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
            >
              Đăng xuất
            </button>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Danh sách học sinh</h2>
          <p className="text-gray-600">
            Tính năng quản lý học sinh sẽ được phát triển tại đây.
          </p>
        </div>
      </div>
    </div>
  );
}