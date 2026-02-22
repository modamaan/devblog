interface BlogPostingJsonLdProps {
    title: string
    description: string
    authorName: string
    datePublished: string
    dateModified?: string
    image?: string
    url: string
}

export function BlogPostingJsonLd({
    title,
    description,
    authorName,
    datePublished,
    dateModified,
    image,
    url,
}: BlogPostingJsonLdProps) {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: title,
        description,
        author: {
            "@type": "Person",
            name: authorName,
        },
        datePublished,
        dateModified: dateModified ?? datePublished,
        ...(image && { image }),
        url,
        publisher: {
            "@type": "Organization",
            name: "DevBlog",
        },
    }

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
    )
}

interface FAQItem {
    question: string
    answer: string
}

interface FAQPageJsonLdProps {
    items: FAQItem[]
}

export function FAQPageJsonLd({ items }: FAQPageJsonLdProps) {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: items.map((item) => ({
            "@type": "Question",
            name: item.question,
            acceptedAnswer: {
                "@type": "Answer",
                text: item.answer,
            },
        })),
    }

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
    )
}
