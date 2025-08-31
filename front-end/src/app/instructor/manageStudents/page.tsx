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
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Manage Students</h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}