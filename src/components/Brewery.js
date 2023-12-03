import React, { useContext, useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import authContext from '../contexts/auth/authContext'
import { Rating } from '@material-ui/lab'
import { TextField, Button } from '@material-ui/core'

const Brewery = () => {
    const { id } = useParams();

    const { isLoggedIn, setLoggedIn } = useContext(authContext)
    const history = useHistory();

    const [item, setItem] = useState(null)
    const [rating, setRating] = useState(0)
    const [review, setReview] = useState("")
    const [reviews, setReviews] = useState([])

    useEffect(() => {
        const checkAuth = async () => {
            (!isLoggedIn) && history.push('/auth')
        };
        checkAuth();
    }, [isLoggedIn, history]);

    useEffect(() => {
        const fetchItemDetails = async () => {
            const res = await fetch(`/v1/breweries?by_ids=${id}`)
            const data = await res.json()
            setItem(data[0])
        }
        fetchItemDetails()
    }, [])

    const fetchReviews = async () => {
        const res = await fetch(`${process.env.REACT_SERVER_BASE_URL || "http://localhost:3000"}/api/reviews/getReviews`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                authToken: localStorage.getItem('authToken'),
                breweryId: id
            })
        })
        const data = await res.json()
        setReviews(data)
    }


    useEffect(() => {
        fetchReviews()
    }, [])

    const handleSaveReview = async () => {
        const res = await fetch(`${process.env.REACT_SERVER_BASE_URL || "http://localhost:3000"}/api/reviews/addReview`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                authToken: localStorage.getItem('authToken'),
                breweryId: id,
                rating,
                review
            })
        })

        if (res.ok) {
            alert("review saved")
        }
    }



    return (
        <div style={styles.container}>
            <h1 style={styles.heading}>{item?.name}</h1>
            <div style={styles.details}>
                <p><strong>Type:</strong> {item?.brewery_type}</p>
                <p><strong>Address:</strong> {item?.address_1}, {item?.city}, {item?.state_province} {item?.postal_code}</p>
                <p><strong>Country:</strong> {item?.country}</p>
                <p><strong>Phone:</strong> {item?.phone}</p>
                <p><strong>Website:</strong> <a href={item?.website_url} target="_blank" rel="noopener noreferrer">{item?.website_url}</a></p>
            </div>
            <div style={{ width: '90%', margin: 'auto' }}>
                <h3>Reviews</h3>

                <hr />

                <p><strong>Add/update your review</strong></p>
                <div style={{ width: '100%', border: 'dashed 1px', borderRadius: '20px', margin: '8px', padding: '8px', display: 'flex', flexDirection: 'column', justifyContent: 'center', backgroundColor: '#ebffec' }}>
                    <div style={{ margin: '4px', alignSelf: 'flex-end' }}>
                        <Rating
                            name="rating"
                            value={rating}
                            onChange={(event, newValue) => {
                                setRating(newValue);
                            }}
                        />
                    </div>
                    <TextField label="write review" value={review} onChange={(event) => setReview(event.target.value)} style={{ margin: '4px' }} />
                    <Button onClick={handleSaveReview} style={{ margin: '4px', alignSelf: 'flex-end' }}>Save</Button>
                </div>
                <p><strong>your review</strong></p>
                <div style={{ width: '100%', border: 'solid 1px', borderRadius: '20px', margin: '8px', padding: '8px', display: 'flex', flexDirection: 'column', justifyContent: 'center', backgroundColor: '#fff7e1' }}>
                    {
                        reviews?.userReview &&
                        <>
                            <div style={{ margin: '4px', alignSelf: 'flex-end' }}>
                                <Rating
                                    readOnly
                                    name="rating"
                                    value={reviews.userReview.rating}
                                />
                            </div>
                            <TextField disabled label="your review" value={reviews.userReview.review} style={{ margin: '4px' }} />
                        </>
                    }
                    {
                        !reviews?.userReview &&
                        <div style={{ padding: '22px' }}>
                            no review found
                        </div>
                    }
                </div>
                <p><strong>all reviews</strong></p>
                <div style={{ width: '100%', margin: '8px', padding: '8px', display: 'flex', flexDirection: 'column' }}>
                    {
                        reviews?.allReviews?.map(review => {
                            return (
                                <div style={{ width: '100%', border: 'solid 1px', borderRadius: '20px', margin: '8px', padding: '8px', display: 'flex', flexDirection: 'column', justifyContent: 'center', margin: 'auto', marginTop: '4px' }}>

                                    <TextField disabled label="username" value={review.username} style={{ margin: '4px' }} />
                                    <div style={{ margin: '4px', alignSelf: 'flex-start' }}>
                                        <Rating
                                            readOnly
                                            name="rating"
                                            value={review.rating}
                                        />
                                    </div>
                                    <TextField disabled label="review" value={review.review} style={{ margin: '4px' }} />

                                </div>
                            )
                        })
                    }
                </div>


            </div>
        </div>
    );
}

const styles = {
    container: {
        maxWidth: '600px',
        margin: '0 auto',
        padding: '20px',
        backgroundColor: '#f7f7f7',
        borderRadius: '8px',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    },
    heading: {
        color: '#333',
        fontSize: '24px',
        marginBottom: '10px',
    },
    details: {
        color: '#555',
        fontSize: '16px',
        lineHeight: '1.6',
    },
};

export default Brewery