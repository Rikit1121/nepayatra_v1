'use client'

import * as React from 'react'
import { MessageCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FloatingWhatsAppProps {
  phone?: string
  advisorName?: string
}

export function FloatingWhatsApp({
  phone = '9779800000000',
}: FloatingWhatsAppProps) {
  const whatsappUrl = `https://wa.me/${phone}?text=Hi%20NepaYatra%2C%20I%20am%20planning%20a%20trip%20to%20Nepal%20and%20would%20love%20some%20guidance.`

  return (
    <div className="fixed bottom-6 right-6 z-30 flex items-center">
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          'group flex items-center gap-2.5 rounded-full border border-emerald-500/30 bg-zinc-950/90 py-2.5 px-4 text-xs font-semibold text-white shadow-2xl backdrop-blur-xl transition-all duration-300 hover:scale-105 hover:border-emerald-400 hover:bg-emerald-950/80 hover:shadow-emerald-900/30'
        )}
        aria-label="Chat with our advisor on WhatsApp"
      >
        {/* Pulsing online beacon */}
        <span className="relative flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
        </span>

        {/* WhatsApp Icon */}
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-zinc-950">
          <MessageCircle className="h-3.5 w-3.5 fill-current" />
        </div>

        <div className="flex flex-col text-left">
          <span className="text-[10px] text-white/50 leading-none">Need assistance?</span>
          <span className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors">
            Chat with our advisor
          </span>
        </div>
      </a>
    </div>
  )
}
