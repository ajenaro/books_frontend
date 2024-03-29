import Link from 'next/link';
import {useState} from "react";
import {useRouter} from "next/router";

export async function getServerSideProps({params}) {
    const res = await fetch(`http://localhost:8000/api/books/${params.bid}`)
    const data = await res.json()

    return {
        props: {
            book: data
        }
    }
}

const BookEdit = ({ book }) => {

    const router = useRouter()
    const [bookTitle, setBookTitle] = useState(book.title)
    const [errors, setErrors] = useState([]);
    const [submitting, setSubmitting] = useState(false);

    async function handleSubmit(e) {

        e.preventDefault();

        setSubmitting(true);

        const res = await fetch(`http://localhost:8000/api/books/${book.id}`, {
            method: 'POST',
            headers: {
                accept: 'application/json',
                'content-type': 'application/json',
            },
            body: JSON.stringify({
                title: bookTitle,
                _method: 'PATCH'
            })
        })

        if(res.ok) {
            setErrors([])
            setBookTitle('')
            return router.push('/books')
        }

        const data = await res.json()
        setErrors(data.errors)
        setSubmitting(false);
    }

    return (
        <>
            <h1>Book Edit</h1>

            <form onSubmit={handleSubmit}>
                <input
                    onChange={(e) => setBookTitle(e.target.value)}
                    value={String(bookTitle)}
                    disabled={submitting}
                    data-cy="input-book-title"
                    type="text"
                />
                <button
                    disabled={submitting}
                    data-cy="button-submit-book"
                >{submitting ? 'Enviando...' : 'Enviar'}
                </button>
                {errors.title && (
                    <span style={{
                        color: 'red', display: 'block'
                    }}>{errors.title}</span>
                )}
            </form>
            <Link href="/books">Book List</Link>
        </>
    )
}

export default BookEdit