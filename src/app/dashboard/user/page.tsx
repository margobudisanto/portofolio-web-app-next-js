'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  Download,
  Star,
  Filter,
  Search,
  BookOpen,
  Award,
  CreditCard,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react'
import Link from 'next/link'

interface UserProfile {
  id: string
  name: string
  email: string
  phone: string
  profession: string
  institution: string
  joinDate: string
  totalSeminars: number
  completedSeminars: number
  totalSpent: number
}

interface Registration {
  id: string
  seminarId: string
  seminarTitle: string
  seminarDate: string
  seminarTime: string
  seminarLocation: string
  seminarCategory: string
  seminarImageUrl?: string
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED' | 'NO_SHOW'
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED'
  paymentMethod?: string
  amount: number
  registeredAt: string
  certificateUrl?: string
  rating?: number
  review?: string
  canReview: boolean
}

export default function UserDashboard() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [registrations, setRegistrations] = useState<Registration[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')

  useEffect(() => {
    // Mock data
    const mockProfile: UserProfile = {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+62 812-3456-7890',
      profession: 'Software Engineer',
      institution: 'PT. Teknologi Indonesia',
      joinDate: '2023-06-15',
      totalSeminars: 12,
      completedSeminars: 8,
      totalSpent: 4800000
    }

    const mockRegistrations: Registration[] = [
      {
        id: '1',
        seminarId: '1',
        seminarTitle: 'Digital Marketing Strategy 2024',
        seminarDate: '2024-02-15',
        seminarTime: '09:00',
        seminarLocation: 'Jakarta Convention Center',
        seminarCategory: 'Marketing',
        seminarImageUrl: '/api/placeholder/300/200',
        status: 'CONFIRMED',
        paymentStatus: 'PAID',
        paymentMethod: 'Transfer Bank',
        amount: 500000,
        registeredAt: '2024-01-25T10:30:00Z',
        canReview: false
      },
      {
        id: '2',
        seminarId: '2',
        seminarTitle: 'AI and Machine Learning Workshop',
        seminarDate: '2024-02-20',
        seminarTime: '13:00',
        seminarLocation: 'Tech Hub Jakarta',
        seminarCategory: 'Technology',
        seminarImageUrl: '/api/placeholder/300/200',
        status: 'CONFIRMED',
        paymentStatus: 'PAID',
        paymentMethod: 'E-Wallet',
        amount: 750000,
        registeredAt: '2024-01-26T14:15:00Z',
        canReview: false
      },
      {
        id: '3',
        seminarId: '3',
        seminarTitle: 'Financial Planning for Young Professionals',
        seminarDate: '2024-01-30',
        seminarTime: '10:00',
        seminarLocation: 'Online Zoom',
        seminarCategory: 'Finance',
        seminarImageUrl: '/api/placeholder/300/200',
        status: 'COMPLETED',
        paymentStatus: 'PAID',
        paymentMethod: 'Credit Card',
        amount: 250000,
        registeredAt: '2024-01-20T09:00:00Z',
        certificateUrl: '/certificates/fin-planning-john-doe.pdf',
        rating: 5,
        review: 'Very informative and practical!',
        canReview: true
      },
      {
        id: '4',
        seminarId: '4',
        seminarTitle: 'Leadership Excellence Program',
        seminarDate: '2024-03-01',
        seminarTime: '09:00',
        seminarLocation: 'Grand Hyatt Jakarta',
        seminarCategory: 'Leadership',
        seminarImageUrl: '/api/placeholder/300/200',
        status: 'PENDING',
        paymentStatus: 'PENDING',
        amount: 1500000,
        registeredAt: '2024-01-28T16:45:00Z',
        canReview: false
      }
    ]

    setTimeout(() => {
      setProfile(mockProfile)
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
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }
    return new Date(dateString).toLocaleDateString('id-ID', options)
  }

  const formatShortDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    }
    return new Date(dateString).toLocaleDateString('id-ID', options)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONFIRMED': return 'bg-green-500'
      case 'PENDING': return 'bg-yellow-500'
      case 'COMPLETED': return 'bg-blue-500'
      case 'CANCELLED': return 'bg-red-500'
      case 'NO_SHOW': return 'bg-gray-500'
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

  const filteredRegistrations = registrations.filter(registration => {
    const matchesSearch = registration.seminarTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         registration.seminarCategory.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === 'all' || registration.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const upcomingSeminars = registrations.filter(r => r.status === 'CONFIRMED')
  const completedSeminars = registrations.filter(r => r.status === 'COMPLETED')
  const pendingPayment = registrations.filter(r => r.paymentStatus === 'PENDING')

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
              <h1 className="text-2xl font-bold text-gray-900">Dashboard Saya</h1>
              <p className="text-sm text-gray-600">Kelola pendaftaran seminar Anda</p>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="outline">Jelajahi Seminar</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* User Profile Card */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-xl">{profile?.name}</CardTitle>
                  <CardDescription>{profile?.email}</CardDescription>
                  <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                    <span>{profile?.profession}</span>
                    <span>•</span>
                    <span>{profile?.institution}</span>
                  </div>
                </div>
              </div>
              <Button variant="outline">
                Edit Profile
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{profile?.totalSeminars}</div>
                <div className="text-sm text-gray-600">Total Seminar</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{profile?.completedSeminars}</div>
                <div className="text-sm text-gray-600">Selesai</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{upcomingSeminars.length}</div>
                <div className="text-sm text-gray-600">Akan Datang</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">{formatPrice(profile?.totalSpent || 0)}</div>
                <div className="text-sm text-gray-600">Total Pengeluaran</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">Pembayaran Pending</h3>
                  <p className="text-2xl font-bold text-orange-600 mt-1">{pendingPayment.length}</p>
                </div>
                <CreditCard className="w-8 h-8 text-orange-500" />
              </div>
              {pendingPayment.length > 0 && (
                <Button size="sm" className="w-full mt-4">
                  Lihat Pembayaran
                </Button>
              )}
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">Sertifikat</h3>
                  <p className="text-2xl font-bold text-green-600 mt-1">
                    {completedSeminars.filter(r => r.certificateUrl).length}
                  </p>
                </div>
                <Award className="w-8 h-8 text-green-500" />
              </div>
              <Button size="sm" variant="outline" className="w-full mt-4">
                Download Sertifikat
              </Button>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">Belum Dinilai</h3>
                  <p className="text-2xl font-bold text-purple-600 mt-1">
                    {completedSeminars.filter(r => r.canReview && !r.rating).length}
                  </p>
                </div>
                <Star className="w-8 h-8 text-purple-500" />
              </div>
              <Button size="sm" variant="outline" className="w-full mt-4">
                Beri Rating
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="upcoming" className="space-y-6">
          <TabsList>
            <TabsTrigger value="upcoming">Akan Datang ({upcomingSeminars.length})</TabsTrigger>
            <TabsTrigger value="completed">Selesai ({completedSeminars.length})</TabsTrigger>
            <TabsTrigger value="all">Semua Pendaftaran</TabsTrigger>
          </TabsList>

          {/* Upcoming Seminars */}
          <TabsContent value="upcoming" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {upcomingSeminars.map((registration) => (
                <Card key={registration.id} className="overflow-hidden">
                  <div className="aspect-video bg-gray-200 relative">
                    <img 
                      src={registration.seminarImageUrl || '/api/placeholder/400/250'} 
                      alt={registration.seminarTitle}
                      className="w-full h-full object-cover"
                    />
                    <Badge className="absolute top-4 right-4 bg-blue-600">
                      {registration.seminarCategory}
                    </Badge>
                  </div>
                  
                  <CardHeader>
                    <CardTitle className="line-clamp-2">{registration.seminarTitle}</CardTitle>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        {formatDate(registration.seminarDate)}
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-2" />
                        {registration.seminarTime} WIB
                      </div>
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-2" />
                        {registration.seminarLocation}
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <Badge className={`${getStatusColor(registration.status)} text-white`}>
                          {registration.status}
                        </Badge>
                      </div>
                      <div className="text-lg font-bold text-blue-600">
                        {formatPrice(registration.amount)}
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Link href={`/seminar/${registration.seminarId}`}>
                        <Button variant="outline" size="sm" className="flex-1">
                          Lihat Detail
                        </Button>
                      </Link>
                      {registration.paymentStatus === 'PENDING' && (
                        <Button size="sm" className="flex-1">
                          Bayar Sekarang
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {upcomingSeminars.length === 0 && (
              <Card>
                <CardContent className="text-center py-12">
                  <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Tidak Ada Seminar Akan Datang</h3>
                  <p className="text-gray-600 mb-4">Anda belum terdaftar di seminar mendatang</p>
                  <Link href="/">
                    <Button>Jelajahi Seminar</Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Completed Seminars */}
          <TabsContent value="completed" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {completedSeminars.map((registration) => (
                <Card key={registration.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="line-clamp-2">{registration.seminarTitle}</CardTitle>
                        <CardDescription>
                          {formatShortDate(registration.seminarDate)}
                        </CardDescription>
                      </div>
                      <Badge className={`${getStatusColor(registration.status)} text-white`}>
                        {registration.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {registration.rating && (
                      <div className="flex items-center space-x-2">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`w-4 h-4 ${i < registration.rating! ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-600">({registration.rating}/5)</span>
                      </div>
                    )}
                    
                    {registration.review && (
                      <p className="text-sm text-gray-600 italic">"{registration.review}"</p>
                    )}
                    
                    <div className="flex space-x-2">
                      {registration.certificateUrl && (
                        <Button variant="outline" size="sm" className="flex-1">
                          <Download className="w-4 h-4 mr-2" />
                          Download Sertifikat
                        </Button>
                      )}
                      {registration.canReview && !registration.rating && (
                        <Button size="sm" className="flex-1">
                          <Star className="w-4 h-4 mr-2" />
                          Beri Rating
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {completedSeminars.length === 0 && (
              <Card>
                <CardContent className="text-center py-12">
                  <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Belum Ada Seminar Selesai</h3>
                  <p className="text-gray-600">Selesaikan seminar untuk melihat sertifikat dan memberi rating</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* All Registrations */}
          <TabsContent value="all" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Semua Pendaftaran</CardTitle>
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
                    <select 
                      className="px-3 py-2 border rounded-md text-sm"
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                    >
                      <option value="all">Semua Status</option>
                      <option value="CONFIRMED">Dikonfirmasi</option>
                      <option value="PENDING">Pending</option>
                      <option value="COMPLETED">Selesai</option>
                      <option value="CANCELLED">Dibatalkan</option>
                    </select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Seminar</th>
                        <th className="text-left p-2">Tanggal</th>
                        <th className="text-left p-2">Status</th>
                        <th className="text-left p-2">Pembayaran</th>
                        <th className="text-left p-2">Jumlah</th>
                        <th className="text-left p-2">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredRegistrations.map((registration) => (
                        <tr key={registration.id} className="border-b hover:bg-gray-50">
                          <td className="p-2">
                            <div>
                              <div className="font-medium text-sm">{registration.seminarTitle}</div>
                              <div className="text-xs text-gray-500">{registration.seminarCategory}</div>
                            </div>
                          </td>
                          <td className="p-2 text-sm">
                            {formatShortDate(registration.seminarDate)}
                          </td>
                          <td className="p-2">
                            <Badge className={`${getStatusColor(registration.status)} text-white text-xs`}>
                              {registration.status}
                            </Badge>
                          </td>
                          <td className="p-2">
                            <Badge className={`${getPaymentStatusColor(registration.paymentStatus)} text-white text-xs`}>
                              {registration.paymentStatus}
                            </Badge>
                          </td>
                          <td className="p-2 text-sm font-medium">
                            {formatPrice(registration.amount)}
                          </td>
                          <td className="p-2">
                            <div className="flex items-center space-x-2">
                              <Link href={`/seminar/${registration.seminarId}`}>
                                <Button variant="ghost" size="sm">
                                  Lihat
                                </Button>
                              </Link>
                              {registration.certificateUrl && (
                                <Button variant="ghost" size="sm">
                                  <Download className="w-4 h-4" />
                                </Button>
                              )}
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
        </Tabs>
      </div>
    </div>
  )
}