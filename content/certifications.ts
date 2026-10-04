export interface Certification {
  readonly id: string
  readonly title: string
  readonly issuer: string
  readonly date: string
  readonly verifyUrl?: string
  readonly pdfUrl?: string
}

export const certifications: readonly Certification[] = []
