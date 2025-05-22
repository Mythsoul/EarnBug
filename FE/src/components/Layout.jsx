import { cn } from "@/lib/utils"

export function PageContainer({ children, className, fullWidth = false }) {
  return (
    <div
      className={cn(
        "container mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12",
        fullWidth ? "max-w-full" : "max-w-7xl",
        className,
      )}
    >
      {children}
    </div>
  )
}

export function PageHeader({ title, description, className }) {
  return (
    <div className={cn("mb-8", className)}>
      <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">{title}</h1>
      {description && <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">{description}</p>}
    </div>
  )
}

export function PageSection({ children, className, title, description }) {
  return (
    <section className={cn("py-8", className)}>
      {(title || description) && (
        <div className="mb-6">
          {title && <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h2>}
          {description && <p className="mt-1 text-gray-600 dark:text-gray-400">{description}</p>}
        </div>
      )}
      {children}
    </section>
  )
}

export function Card({ children, className }) {
  return (
    <div
      className={cn(
        "bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg shadow-sm p-6",
        className,
      )}
    >
      {children}
    </div>
  )
}
