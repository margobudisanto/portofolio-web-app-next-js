'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Users, 
  Calendar, 
  DollarSign, 
  TrendingUp,
  Plus,
  Eye,
  Edit,
  Trash2,
  Filter,
  Search,
  BarChart3,
  UserCheck,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react'
import Link from 'next/link'

interface DashboardStats {
  totalSeminars: number
  totalParticipants: number
  totalRevenue: number
  upcomingSeminars: number
  activeUsers: number
  pendingRegistrations: number
}

interface Seminar {
  id: string
  title: string
  date: string
  time: string
  location: string
  maxParticipants: number
  currentParticipants: number
  status: 'DRAFT' | 'PUBLISHED' | 'ONGOING' | 'COMPLETED' | 'CANCELLED'
  revenue: number
  category: string
}

interface Registration {
  id: string
  userName: string
  userEmail: string
  seminarTitle: string
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED'
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED'
  registeredAt: string
  amount: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [seminars, setSeminars] = useState<Seminar[]>([])
  const [registrations, setRegistrations] = useState<Registration[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    // Mock data
    const mockStats: DashboardStats = {
      totalSeminars: 24,
      totalParticipants: 1250,
      totalRevenue: 625000000,
      upcomingSeminars: 8,
      activeUsers: 890,
      pendingRegistrations: 45
    }

    const mockSeminars: Seminar[] = [
      {
        id: '1',
        title: 'Digital Marketing Strategy 2024',
        date: '2024-02-15',
        time: '09:00',
        location: 'Jakarta Convention Center',
        maxParticipants: 100,
        currentParticipants: 75,
        status: 'PUBLISHED',
        revenue: 37500000,
        category: 'Marketing'
      },
      {
        id: '2',
        title: 'AI and Machine Learning Workshop',
        date: '2024-02-20',
        time: '13:00',
        location: 'Tech Hub Jakarta',
        maxParticipants: 50,
        currentParticipants: 32,
        status: 'PUBLISHED',
        revenue: 24000000,
        category: 'Technology'
      },
      {
        id: '3',
        title: 'Financial Planning for Young Professionals',
        date: '2024-01-30',
        time: '10:00',
        location: 'Online Zoom',
        maxParticipants: 200,
        currentParticipants: 180,
        status: 'COMPLETED',
        revenue: 45000000,
        category: 'Finance'
      },
      {
        id: '4',
        title: 'Leadership Excellence Program',
        date: '2024-03-01',
        time: '09:00',
        location: 'Grand Hyatt Jakarta',
        maxParticipants: 80,
        currentParticipants: 0,
        status: 'DRAFT',
        revenue: 0,
        category: 'Leadership'
      }
    ]

    const mockRegistrations: Registration[] = [
      {
        id: '1',
        userName: 'John Doe',
        userEmail: 'john@example.com',
        seminarTitle: 'Digital Marketing Strategy 2024',
        status: 'CONFIRMED',
        paymentStatus: 'PAID',
        registeredAt: '2024-01-25T10:30:00Z',
        amount: 500000
      },
      {
        id: '2',
        userName: 'Jane Smith',
        userEmail: 'jane@example.com',
        seminarTitle: 'AI and Machine Learning Workshop',
        status: 'PENDING',
        paymentStatus: 'PENDING',
        registeredAt: '2024-01-26T14:15:00Z',
        amount: 750000
      },
      {
        id: '3',
        userName: 'Bob Johnson',
        userEmail: 'bob@example.com',
        seminarTitle: 'Financial Planning for Young Professionals',
        status: 'COMPLETED',
        paymentStatus: 'PAID',
        registeredAt: '2024-01-20T09:00:00Z',
        amount: 250000
      }
    ]

    setTimeout(() => {
      setStats(mockStats)
      setSeminars(mockSeminars)
      setRegistrations(mockRegistrations)
      setLoading(false)
    }, 1000)
  }, [])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price)
  }

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    }
    return new Date(dateString).toLocaleDateString('id-ID', options)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PUBLISHED': return 'bg-green-500'
      case 'DRAFT': return 'bg-gray-500'
      case 'COMPLETED': return 'bg-blue-500'
      case 'CANCELLED': return 'bg-red-500'
      case 'ONGOING': return 'bg-yellow-500'
      default: return 'bg-gray-500'
    }
  }

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'PAID': return 'bg-green-500'
      case 'PENDING': return 'bg-yellow-500'
      case 'FAILED': return 'bg-red-500'
      case 'REFUNDED': return 'bg-gray-500'
      default: return 'bg-gray-500'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-sm text-gray-600">Kelola seminar dan peserta</p>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/seminar/create">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Buat Seminar Baru
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Seminar</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalSeminars}</div>
              <p className="text-xs text-muted-foreground">
                {stats?.upcomingSeminars} akan datang
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Peserta</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalParticipants.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                {stats?.activeUsers} pengguna aktif
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Pendapatan</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatPrice(stats?.totalRevenue || 0)}</div>
              <p className="text-xs text-muted-foreground">
                <TrendingUp className="inline w-3 h-3 mr-1" />
                +12% dari bulan lalu
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pendaftaran Pending</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.pendingRegistrations}</div>
              <p className="text-xs text-muted-foreground">
                Menunggu konfirmasi
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="seminars" className="space-y-6">
          <TabsList>
            <TabsTrigger value="seminars">Seminar</TabsTrigger>
            <TabsTrigger value="registrations">Pendaftaran</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Seminars Tab */}
          <TabsContent value="seminars" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Daftar Seminar</CardTitle>
                  <div className="flex items-center space-x-2">
                    <div className="relative">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <input
                        type="text"
                        placeholder="Cari seminar..."
                        className="pl-8 pr-3 py-2 border rounded-md text-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <Button variant="outline" size="sm">
                      <Filter className="w-4 h-4 mr-2" />
                      Filter
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Judul</th>
                        <th className="text-left p-2">Tanggal</th>
                        <th className="text-left p-2">Lokasi</th>
                        <th className="text-left p-2">Peserta</th>
                        <th className="text-left p-2">Status</th>
                        <th className="text-left p-2">Pendapatan</th>
                        <th className="text-left p-2">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {seminars.map((seminar) => (
                        <tr key={seminar.id} className="border-b hover:bg-gray-50">
                          <td className="p-2">
                            <div>
                              <div className="font-medium">{seminar.title}</div>
                              <div className="text-sm text-gray-500">{seminar.category}</div>
                            </div>
                          </td>
                          <td className="p-2">
                            <div className="text-sm">
                              {formatDate(seminar.date)}
                              <div className="text-gray-500">{seminar.time}</div>
                            </div>
                          </td>
                          <td className="p-2 text-sm">{seminar.location}</td>
                          <td className="p-2">
                            <div className="text-sm">
                              {seminar.currentParticipants}/{seminar.maxParticipants}
                              <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                                <div 
                                  className="bg-blue-600 h-1.5 rounded-full"
                                  style={{ width: `${(seminar.currentParticipants / seminar.maxParticipants) * 100}%` }}
                                ></div>
                              </div>
                            </div>
                          </td>
                          <td className="p-2">
                            <Badge className={`${getStatusColor(seminar.status)} text-white`}>
                              {seminar.status}
                            </Badge>
                          </td>
                          <td className="p-2 text-sm font-medium">
                            {formatPrice(seminar.revenue)}
                          </td>
                          <td className="p-2">
                            <div className="flex items-center space-x-2">
                              <Button variant="ghost" size="sm">
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm" className="text-red-600">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Registrations Tab */}
          <TabsContent value="registrations" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Pendaftaran Terbaru</CardTitle>
                <CardDescription>
                  Kelola pendaftaran dan pembayaran peserta
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Peserta</th>
                        <th className="text-left p-2">Seminar</th>
                        <th className="text-left p-2">Tanggal Daftar</th>
                        <th className="text-left p-2">Status</th>
                        <th className="text-left p-2">Pembayaran</th>
                        <th className="text-left p-2">Jumlah</th>
                        <th className="text-left p-2">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {registrations.map((registration) => (
                        <tr key={registration.id} className="border-b hover:bg-gray-50">
                          <td className="p-2">
                            <div>
                              <div className="font-medium">{registration.userName}</div>
                              <div className="text-sm text-gray-500">{registration.userEmail}</div>
                            </div>
                          </td>
                          <td className="p-2 text-sm">{registration.seminarTitle}</td>
                          <td className="p-2 text-sm">
                            {formatDate(registration.registeredAt)}
                          </td>
                          <td className="p-2">
                            <Badge className={`${getStatusColor(registration.status)} text-white`}>
                              {registration.status}
                            </Badge>
                          </td>
                          <td className="p-2">
                            <Badge className={`${getPaymentStatusColor(registration.paymentStatus)} text-white`}>
                              {registration.paymentStatus}
                            </Badge>
                          </td>
                          <td className="p-2 text-sm font-medium">
                            {formatPrice(registration.amount)}
                          </td>
                          <td className="p-2">
                            <div className="flex items-center space-x-2">
                              {registration.status === 'PENDING' && (
                                <>
                                  <Button variant="ghost" size="sm" className="text-green-600">
                                    <CheckCircle className="w-4 h-4" />
                                  </Button>
                                  <Button variant="ghost" size="sm" className="text-red-600">
                                    <XCircle className="w-4 h-4" />
                                  </Button>
                                </>
                              )}
                              <Button variant="ghost" size="sm">
                                <Eye className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="w-5 h-5 mr-2" />
                    Statistik Bulanan
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                    <p className="text-gray-500">Chart akan ditampilkan di sini</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2" />
                    Pertumbuhan Peserta
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                    <p className="text-gray-500">Chart akan ditampilkan di sini</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="w-5 h-5 mr-2" />
                    Seminar Populer
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {seminars.slice(0, 5).map((seminar, index) => (
                      <div key={seminar.id} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-medium">
                            {index + 1}
                          </div>
                          <div>
                            <div className="font-medium text-sm">{seminar.title}</div>
                            <div className="text-xs text-gray-500">{seminar.currentParticipants} peserta</div>
                          </div>
                        </div>
                        <div className="text-sm font-medium">
                          {formatPrice(seminar.revenue)}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <UserCheck className="w-5 h-5 mr-2" />
                    Kategori Terpopuler
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Marketing</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                        </div>
                        <span className="text-sm font-medium">75%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Technology</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div className="bg-green-600 h-2 rounded-full" style={{ width: '60%' }}></div>
                        </div>
                        <span className="text-sm font-medium">60%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Finance</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div className="bg-purple-600 h-2 rounded-full" style={{ width: '45%' }}></div>
                        </div>
                        <span className="text-sm font-medium">45%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Leadership</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div className="bg-orange-600 h-2 rounded-full" style={{ width: '30%' }}></div>
                        </div>
                        <span className="text-sm font-medium">30%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}