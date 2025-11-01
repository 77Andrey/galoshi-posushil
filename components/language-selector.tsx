"use client"

import { useLanguage } from "@/components/language-provider"
import { Globe } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const languages = [
  { code: 'en' as const, name: 'English', flag: '🇬🇧', display: '🇬🇧 English' },
  { code: 'ru' as const, name: 'Русский', flag: '🇷🇺', display: '🇷🇺 Русский' },
  { code: 'th' as const, name: 'ไทย', flag: '🇹🇭', display: '🇹🇭 ไทย' },
]

export function LanguageSelector() {
  const { language, setLanguage } = useLanguage()
  const currentLang = languages.find((l) => l.code === language) || languages[0]

  return (
    <Select value={language} onValueChange={(value) => setLanguage(value as any)}>
      <SelectTrigger className="w-[140px] gap-2">
        <Globe className="w-4 h-4" />
        <SelectValue>
          <span className="hidden md:inline">{currentLang.display}</span>
          <span className="md:hidden">{currentLang.flag}</span>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {languages.map((lang) => (
          <SelectItem key={lang.code} value={lang.code}>
            <span className="flex items-center gap-2">
              <span>{lang.flag}</span>
              <span>{lang.name}</span>
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

