import { z } from 'zod'
import { onIntegrateDomain } from '@/actions/settings'
import { toast } from 'sonner'
import { AddDomainSchema } from '@/schemas/settings.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { UploadClient } from '@uploadcare/upload-client'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { FieldValues, useForm, UseFormRegister } from 'react-hook-form'

type AddDomainSchemaType = z.infer<typeof AddDomainSchema>

const upload = new UploadClient({
  publicKey: process.env.NEXT_PUBLIC_UPLOAD_CARE_PUBLIC_KEY as string,
})

export const useDomain = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AddDomainSchemaType>({
    resolver: zodResolver(AddDomainSchema)
  })

  const pathname = usePathname()
  const [loading, setLoading] = useState<boolean>(false)
  const [isDomain, setIsDomain] = useState<string | undefined>(undefined)
  const router = useRouter()

  useEffect(() => {
    setIsDomain(pathname.split('/').pop())
  }, [pathname])

  const onAddDomain = handleSubmit(async (values: FieldValues) => {
    setLoading(true)
    const uploaded = await upload.uploadFile(values.image[0])
    const domain = await onIntegrateDomain(values.domain, uploaded.uuid)
    if (domain) {
      reset()
      setLoading(false)
      if (domain.status == 200) {
        toast.success(domain.message);
      } else {
        toast.error(domain.message);
      }
      router.refresh()
    }
  })

  return {
    register: register as unknown as UseFormRegister<FieldValues>,
    onAddDomain,
    errors,
    loading,
    isDomain,
  }
}