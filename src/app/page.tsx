'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CalendarDays, MapPin, Users, Clock, User } from 'lucide-react'
import Link from 'next/link'

interface Seminar {
  id: string
  title: string
  description: string
  date: string
  time: string
  location: string
  speaker: string
  maxParticipants: number
  currentParticipants: number
  category: string
  price: number
  imageUrl?: string
}

export default function Home() {
  const [seminars, setSeminars] = useState<Seminar[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mock data untuk sementara
    const mockSeminars: Seminar[] = [
      {
        id: '1',
        title: 'Digital Marketing Strategy 2024',
        description: 'Pelajari strategi digital marketing terbaru untuk meningkatkan bisnis Anda di era digital.',
        date: '2024-02-15',
        time: '09:00',
        location: 'Jakarta Convention Center',
        speaker: 'Dr. Ahmad Wijaya',
        maxParticipants: 100,
        currentParticipants: 75,
        category: 'Marketing',
        price: 500000,
        imageUrl: '/api/placeholder/400/250'
      },
      {
        id: '2',
        title: 'AI and Machine Learning Workshop',
        description: 'Workshop hands-on tentang implementasi AI dan Machine Learning dalam bisnis.',
        date: '2024-02-20',
        time: '13:00',
        location: 'Tech Hub Jakarta',
        speaker: 'Prof. Sarah Chen',
        maxParticipants: 50,
        currentParticipants: 32,
        category: 'Technology',
        price: 750000,
        imageUrl: '/api/placeholder/400/250'
      },
      {
        id: '3',
        title: 'Financial Planning for Young Professionals',
        description: 'Panduan lengkap perencanaan keuangan untuk profesional muda.',
        date: '2024-02-25',
        time: '10:00',
        location: 'Online Zoom',
        speaker: 'Michael Santoso, CFP',
        maxParticipants: 200,
        currentParticipants: 120,
        category: 'Finance',
        price: 250000,
        imageUrl: '/api/placeholder/400/250'
      }
    ]
    
    setTimeout(() => {
      setSeminars(mockSeminars)
      setLoading(false)
    }, 1000)
  }, [])

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

  const getAvailableSlots = (max: number, current: number) => {
    const available = max - current
    const percentage = (current / max) * 100
    
    let color = 'bg-green-500'
    if (percentage > 80) color = 'bg-red-500'
    else if (percentage > 60) color = 'bg-yellow-500'
    
    return { available, color, percentage }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat seminar...</p>
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
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">SeminarKu</h1>
            </div>
            <nav className="flex space-x-4">
              <Link href="/auth/login">
                <Button variant="outline">Masuk</Button>
              </Link>
              <Link href="/auth/register">
                <Button>Daftar</Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-4">Temukan Seminar Terbaik untuk Anda</h2>
          <p className="text-xl mb-8">Bergabunglah dengan ribuan profesional yang telah meningkatkan skill mereka</p>
          <div className="flex justify-center space-x-4">
            <Button size="lg" variant="secondary">
              Jelajahi Seminar
            </Button>
            <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-blue-600">
              Buat Seminar
            </Button>
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
            <div className="p-6">
              <div className="text-3xl font-bold text-blue-600 mb-2">50+</div>
              <div className="text-gray-600">Seminar Aktif</div>
            </div>
            <div className="p-6">
              <div className="text-3xl font-bold text-green-600 mb-2">5,000+</div>
              <div className="text-gray-600">Peserta</div>
            </div>
            <div className="p-6">
              <div className="text-3xl font-bold text-purple-600 mb-2">100+</div>
              <div className="text-gray-600">Pembicara</div>
            </div>
            <div className="p-6">
              <div className="text-3xl font-bold text-orange-600 mb-2">4.8</div>
              <div className="text-gray-600">Rating Rata-rata</div>
            </div>
          </div>
        </div>
      </section>

      {/* Seminars List */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900">Seminar Mendatang</h3>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">Semua</Button>
              <Button variant="ghost" size="sm">Marketing</Button>
              <Button variant="ghost" size="sm">Technology</Button>
              <Button variant="ghost" size="sm">Finance</Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {seminars.map((seminar) => {
              const { available, color, percentage } = getAvailableSlots(
                seminar.maxParticipants,
                seminar.currentParticipants
              )
              
              return (
                <Card key={seminar.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-video bg-gray-200 relative">
                    <img 
                      src={seminar.imageUrl} 
                      alt={seminar.title}
                      className="w-full h-full object-cover"
                    />
                    <Badge className="absolute top-4 right-4 bg-blue-600">
                      {seminar.category}
                    </Badge>
                  </div>
                  
                  <CardHeader>
                    <CardTitle className="line-clamp-2">{seminar.title}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {seminar.description}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-3">
                    <div className="flex items-center text-sm text-gray-600">
                      <CalendarDays className="w-4 h-4 mr-2" />
                      {formatDate(seminar.date)}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="w-4 h-4 mr-2" />
                      {seminar.time} WIB
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="w-4 h-4 mr-2" />
                      {seminar.location}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <User className="w-4 h-4 mr-2" />
                      {seminar.speaker}
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Tersedia {available} slot</span>
                        <span className="font-medium">{seminar.currentParticipants}/{seminar.maxParticipants}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`${color} h-2 rounded-full transition-all`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  </CardContent>
                  
                  <CardFooter className="flex justify-between items-center">
                    <div className="text-lg font-bold text-blue-600">
                      {formatPrice(seminar.price)}
                    </div>
                    <Button 
                      className="w-24"
                      disabled={available === 0}
                    >
                      {available === 0 ? 'Penuh' : 'Daftar'}
                    </Button>
                  </CardFooter>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">SeminarKu</h3>
              <p className="text-gray-400">Platform pendaftaran seminar terpercaya di Indonesia</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Layanan</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Daftar Seminar</li>
                <li>Buat Seminar</li>
                <li>Sertifikat</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Bantuan</h4>
              <ul className="space-y-2 text-gray-400">
                <li>FAQ</li>
                <li>Kontak</li>
                <li>Syarat & Ketentuan</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Ikuti Kami</h4>
              <div className="flex space-x-4">
                <div className="w-8 h-8 bg-gray-700 rounded"></div>
                <div className="w-8 h-8 bg-gray-700 rounded"></div>
                <div className="w-8 h-8 bg-gray-700 rounded"></div>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 SeminarKu. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}