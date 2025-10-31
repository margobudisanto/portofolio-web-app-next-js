'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  CalendarDays, 
  MapPin, 
  Clock, 
  User, 
  Users, 
  Tag,
  CreditCard,
  CheckCircle,
  AlertCircle,
  ArrowLeft
} from 'lucide-react'
import Link from 'next/link'

interface Seminar {
  id: string
  title: string
  description: string
  shortDescription: string
  date: string
  time: string
  duration: number
  location: string
  locationType: 'ONLINE' | 'OFFLINE' | 'HYBRID'
  speaker: string
  speakerBio: string
  maxParticipants: number
  currentParticipants: number
  category: string
  price: number
  earlyBirdPrice?: number
  earlyBirdDeadline?: string
  status: string
  tags: string[]
  requirements: string[]
  materials: string[]
  agenda: { time: string; title: string; description: string }[]
  imageUrl?: string
}

export default function SeminarDetailPage() {
  const params = useParams()
  const seminarId = params.id as string
  
  const [seminar, setSeminar] = useState<Seminar | null>(null)
  const [loading, setLoading] = useState(true)
  const [registering, setRegistering] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    // Mock data - dalam implementasi nyata, ini akan fetch dari API
    const mockSeminar: Seminar = {
      id: seminarId,
      title: 'Digital Marketing Strategy 2024',
      description: `Pelajari strategi digital marketing terbaru untuk meningkatkan bisnis Anda di era digital. Workshop ini akan membahas secara mendalam tentang:

1. Search Engine Optimization (SEO) terkini
2. Social Media Marketing yang efektif
3. Content Marketing Strategy
4. Email Marketing Automation
5. Paid Advertising (Google Ads, Facebook Ads)
6. Analytics dan Data-Driven Marketing
7. Building Personal Brand
8. Customer Journey Mapping

Peserta akan mendapatkan hands-on experience dengan case study nyata dan workshop praktis yang dapat langsung diterapkan dalam bisnis mereka.`,
      shortDescription: 'Pelajari strategi digital marketing terbaru untuk meningkatkan bisnis Anda di era digital.',
      date: '2024-02-15',
      time: '09:00',
      duration: 480, // 8 jam
      location: 'Jakarta Convention Center, Hall A',
      locationType: 'OFFLINE',
      speaker: 'Dr. Ahmad Wijaya, S.Si., M.M.',
      speakerBio: 'Digital Marketing Expert dengan pengalaman 15+ tahun di berbagai perusahaan multinasional. Founder dari Digital Growth Agency dan author buku "Digital Marketing Mastery".',
      maxParticipants: 100,
      currentParticipants: 75,
      category: 'Marketing',
      price: 500000,
      earlyBirdPrice: 350000,
      earlyBirdDeadline: '2024-02-01',
      status: 'PUBLISHED',
      tags: ['Digital Marketing', 'SEO', 'Social Media', 'Content Strategy'],
      requirements: [
        'Laptop atau tablet',
        'Notebook dan alat tulis',
        'Basic understanding of marketing concepts',
        'Google Account untuk Google Analytics workshop'
      ],
      materials: [
        'Digital Marketing Workbook',
        'SEO Checklist Template',
        'Content Calendar Template',
        'Social Media Strategy Guide',
        'Certificate of Completion'
      ],
      agenda: [
        { time: '09:00 - 09:30', title: 'Registration & Coffee', description: 'Registrasi peserta dan sarapan pagi' },
        { time: '09:30 - 10:30', title: 'Introduction to Digital Marketing Landscape', description: 'Overview digital marketing 2024 dan tren terkini' },
        { time: '10:30 - 11:30', title: 'SEO Strategy Deep Dive', description: 'Teknik SEO terbaru dan best practices' },
        { time: '11:30 - 12:30', title: 'Lunch Break', description: 'Makan siang dan networking' },
        { time: '12:30 - 13:30', title: 'Social Media Marketing', description: 'Strategy untuk berbagai platform social media' },
        { time: '13:30 - 14:30', title: 'Content Marketing Workshop', description: 'Hands-on content creation dan planning' },
        { time: '14:30 - 15:30', title: 'Paid Advertising Masterclass', description: 'Google Ads dan Social Media Ads optimization' },
        { time: '15:30 - 16:00', title: 'Coffee Break & Q&A', description: 'Istirahat dan sesi tanya jawab' },
        { time: '16:00 - 17:00', title: 'Analytics & Reporting', description: 'Measuring success dan ROI optimization' },
        { time: '17:00 - 17:30', title: 'Wrap Up & Next Steps', description: 'Summary dan action plan' }
      ],
      imageUrl: '/api/placeholder/800/400'
    }

    setTimeout(() => {
      setSeminar(mockSeminar)
      setLoading(false)
    }, 1000)
  }, [seminarId])

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }
    return new Date(dateString).toLocaleDateString('id-ID', options)
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR'
    }).format(price)
  }

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours} jam ${mins > 0 ? mins + ' menit' : ''}`
  }

  const isEarlyBird = () => {
    if (!seminar?.earlyBirdPrice || !seminar?.earlyBirdDeadline) return false
    return new Date() < new Date(seminar.earlyBirdDeadline)
  }

  const getAvailableSlots = () => {
    if (!seminar) return { available: 0, percentage: 0, color: 'bg-green-500' }
    const available = seminar.maxParticipants - seminar.currentParticipants
    const percentage = (seminar.currentParticipants / seminar.maxParticipants) * 100
    
    let color = 'bg-green-500'
    if (percentage > 80) color = 'bg-red-500'
    else if (percentage > 60) color = 'bg-yellow-500'
    
    return { available, percentage, color }
  }

  const handleRegistration = async () => {
    setRegistering(true)
    setError('')
    setSuccess('')

    try {
      // Simulasi API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      setSuccess('Pendaftaran berhasil! Anda akan diarahkan ke halaman pembayaran.')
      
      setTimeout(() => {
        // Redirect ke payment page
        window.location.href = `/payment/${seminarId}`
      }, 2000)

    } catch (err) {
      setError('Terjadi kesalahan. Silakan coba lagi.')
    } finally {
      setRegistering(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat detail seminar...</p>
        </div>
      </div>
    )
  }

  if (!seminar) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Seminar Tidak Ditemukan</h2>
          <p className="text-gray-600 mb-4">Seminar yang Anda cari tidak tersedia.</p>
          <Link href="/">
            <Button>Kembali ke Beranda</Button>
          </Link>
        </div>
      </div>
    )
  }

  const { available, percentage, color } = getAvailableSlots()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Link href="/" className="flex items-center text-gray-600 hover:text-gray-900">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Hero Section */}
            <Card>
              <div className="aspect-video bg-gray-200 relative">
                <img 
                  src={seminar.imageUrl || '/api/placeholder/800/400'} 
                  alt={seminar.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4">
                  <Badge className="bg-blue-600">{seminar.category}</Badge>
                </div>
              </div>
              
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-2xl font-bold mb-2">{seminar.title}</CardTitle>
                    <CardDescription className="text-base">
                      {seminar.shortDescription}
                    </CardDescription>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 mt-4">
                  {seminar.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary">{tag}</Badge>
                  ))}
                </div>
              </CardHeader>
            </Card>

            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle>Tentang Seminar</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  {seminar.description.split('\n').map((paragraph, index) => (
                    <p key={index} className="mb-4 text-gray-700">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Agenda */}
            <Card>
              <CardHeader>
                <CardTitle>Agenda Acara</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {seminar.agenda.map((item, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="flex-shrink-0 w-32 text-sm font-medium text-gray-900">
                        {item.time}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{item.title}</h4>
                        <p className="text-sm text-gray-600">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Speaker */}
            <Card>
              <CardHeader>
                <CardTitle>Pembicara</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                    <User className="w-8 h-8 text-gray-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{seminar.speaker}</h3>
                    <p className="text-gray-600 mt-2">{seminar.speakerBio}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Requirements & Materials */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Persyaratan</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {seminar.requirements.map((req, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{req}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Materials</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {seminar.materials.map((material, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{material}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Registration Card */}
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle className="text-xl">Detail Pendaftaran</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Date & Time */}
                <div className="space-y-3">
                  <div className="flex items-center text-sm">
                    <CalendarDays className="w-4 h-4 mr-3 text-gray-500" />
                    <span>{formatDate(seminar.date)}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Clock className="w-4 h-4 mr-3 text-gray-500" />
                    <span>{seminar.time} WIB ({formatDuration(seminar.duration)})</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <MapPin className="w-4 h-4 mr-3 text-gray-500" />
                    <span>{seminar.location}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Users className="w-4 h-4 mr-3 text-gray-500" />
                    <span>{seminar.currentParticipants}/{seminar.maxParticipants} peserta</span>
                  </div>
                </div>

                <Separator />

                {/* Availability */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tersedia {available} slot</span>
                    <span className="font-medium">{Math.round(percentage)}% terisi</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`${color} h-2 rounded-full transition-all`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>

                <Separator />

                {/* Pricing */}
                <div className="space-y-3">
                  {isEarlyBird() && (
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-sm font-medium text-green-800">Early Bird Price!</p>
                      <p className="text-xs text-green-600">
                        Berlaku sampai {formatDate(seminar.earlyBirdDeadline!)}
                      </p>
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    {isEarlyBird() && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 line-through">
                          {formatPrice(seminar.price)}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-blue-600">
                        {formatPrice(isEarlyBird() ? seminar.earlyBirdPrice! : seminar.price)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Alert Messages */}
                {error && (
                  <Alert className="border-red-200 bg-red-50">
                    <AlertDescription className="text-red-800">
                      {error}
                    </AlertDescription>
                  </Alert>
                )}

                {success && (
                  <Alert className="border-green-200 bg-green-50">
                    <AlertDescription className="text-green-800">
                      {success}
                    </AlertDescription>
                  </Alert>
                )}

                {/* Register Button */}
                <Button 
                  className="w-full" 
                  size="lg"
                  onClick={handleRegistration}
                  disabled={available === 0 || registering}
                >
                  {registering ? (
                    'Memproses...'
                  ) : available === 0 ? (
                    'Pendaftaran Ditutup'
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4 mr-2" />
                      Daftar Sekarang
                    </>
                  )}
                </Button>

                <p className="text-xs text-gray-500 text-center">
                  Pembayaran aman dan terenkripsi
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}