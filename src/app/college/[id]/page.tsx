"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Navbar from "../../components/Navbar/page";
import Head from "next/head";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import Footer from "@/app/components/Footer/page";

type College = {
  college_name: string;
  branches?: string[];
  Rating?: number;
  photo?: string;
  Map?: string;
};

type Review = {
  _id: string;
  userId: string;
  username: string;
  rating: number;
  reviewText: string;
  createdAt: string;
};

export default function CollegePage() {
  const { id } = useParams<{ id: string }>();
  const [college, setCollege] = useState<College | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(5);
  const [showBranches, setShowBranches] = useState(false);

  // Fetch college data
  useEffect(() => {
    async function fetchCollege() {
      try {
        const response = await fetch(`/api/colleges/${id}`);
        if (!response.ok) throw new Error("Failed to fetch college data");
        const data: College = await response.json();
        setCollege(data);
      } catch (error) {
        console.error("Error fetching college details:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchCollege();
  }, [id]);

  // Update title dynamically
  useEffect(() => {
    if (college?.college_name) {
      document.title = `${college.college_name} | College Junction`;
    }
  }, [college]);

  if (loading) return <p className="loading-text">Loading college details...</p>;
  if (!college) return <p className="loading-text">College not found.</p>;

  // Validate Google Maps URL
  const isValidMapUrl = college.Map?.startsWith("https://www.google.com/maps/embed");

  return (
    <>
      <Head>
        <meta name="description" content="Welcome to the home page of College Junction." />
      </Head>
      <Navbar />
      <div className="collegesss">

        <div className="review-section">
          <div className="review-left">
            <h1>{college.college_name}</h1>
            <h2>
              Branches: {college.branches?.[0] || "N/A"} 
              {college.branches && college.branches.length > 1 && (
                <span 
                  className="branch-toggle" 
                  onClick={() => setShowBranches(!showBranches)}
                  style={{ cursor: "pointer", marginLeft: "10px" }}
                >
                  {showBranches ? <FaChevronUp /> : <FaChevronDown />}
                </span>
              )}
            </h2>
            {showBranches && (
              <ul className="branch-list">
                {college.branches?.slice(1).map((branch, index) => (
                  <li key={index}>{branch}</li>
                ))}
              </ul>
            )}
            <h3>Rating: {college.Rating || "N/A"} ⭐</h3>
          </div>
          <div className="review-right">
            {college.photo ? (
              <Image
                src={college.photo}
                alt="College Image"
                height={315}
                width={630}
                unoptimized
              />
            ) : (
              <p>No Image Available</p>
            )}
          </div>
        </div>

        <div className="college-address">
          <div className="college-details">
            <h3>College Details & Address</h3>
            {isValidMapUrl ? (
              <iframe
                src={college.Map}
                width="100%"
                height="450"
                style={{ border: "0" }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="College Location"
              ></iframe>
            ) : (
              <p>No Map Available or Invalid URL</p>
            )}
          </div>
          <div className="college-timings">
            <h3>Monday - Saturday: 09:00 AM to 06:00 PM</h3>
            <h3>Sunday: Closed</h3>
          </div>
        </div>

        <div className="review-summary">
          <h1>Review</h1>
          <h1>⭐ {college.Rating || "N/A"}</h1>
        </div>

        
        {/* <div className="review-section">
          <h2>Reviews</h2>
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <div key={review._id} className="review">
                <h4>{review.username} - {review.rating} ⭐</h4>
                <p>{review.reviewText}</p>
                <small>{new Date(review.createdAt).toLocaleDateString()}</small>
              </div>
            ))
          ) : (
            <p>No reviews yet.</p>
          )}
        </div>

        {session ? (
          <form onSubmit={handleSubmitReview} className="review-form">
            <h3>Leave a Review</h3>
            <input
              type="number"
              min="1"
              max="5"
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              required
            />
            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Write your review here..."
              required
            />
            <button type="submit">Submit Review</button>
          </form>
        ) : (
          <p>Please <a href="/components/Login">log in</a> to leave a review.</p>
        )} */}
        <Footer/>
      </div>
    </>
  );
}
