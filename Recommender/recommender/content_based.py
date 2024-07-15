from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from db import db
from bson import ObjectId
import numpy as np
import arabic_reshaper
from bidi.algorithm import get_display


def compute_tfidf_matrix(products, field):
    texts = [product[field] for product in products]
    vectorizer = TfidfVectorizer()
    tfidf_matrix = vectorizer.fit_transform(texts)
    return tfidf_matrix, vectorizer


def compute_cosine_similarity(user_product_vector, product_vectors):
    cosine_similarities = cosine_similarity(user_product_vector, product_vectors)
    return cosine_similarities


def recommend_similar_products(user_id):
    try:
        favorites_collection = db["favorites"]
        products_collection = db["products"]

        user_object_id = ObjectId(user_id)
        user = favorites_collection.find_one({"userId": user_object_id})

        if not user:
            print(f"User with ID {user_id} does not exist.")
            return []

        favorite_product_ids = user.get("products", [])

        favorite_products = []
        for product in favorite_product_ids:
            product = products_collection.find_one(
                {"_id": ObjectId(product["productId"])}
            )
            if product:
                favorite_products.append(product)

        for favorite_product in favorite_products:
            reshaped_text = arabic_reshaper.reshape(favorite_product["name"])
            bidi_text = get_display(reshaped_text)
            favorite_product["name"] = bidi_text

        all_products = list(products_collection.find())
        for product in all_products:
            reshaped_text = arabic_reshaper.reshape(product["name"])
            bidi_text = get_display(reshaped_text)
            product["name"] = bidi_text

        name_tfidf_matrix, name_vectorizer = compute_tfidf_matrix(all_products, "name")

        user_product_names = [product["name"] for product in favorite_products]
        print(f"all favorite Products for user with id = {user_id}", user_product_names)

        user_name_vector = name_vectorizer.transform(user_product_names)

        name_cosine_similarities = compute_cosine_similarity(
            user_name_vector, name_tfidf_matrix
        )

        top_similar_products = []
        num_top_products = 2  # Number of top products to retrieve per favorite product

        for i, user_product_name in enumerate(user_product_names):
            cosine_similarities = name_cosine_similarities[i]
            sorted_indices = np.argsort(cosine_similarities)[::-1]

            similar_product_indices = sorted_indices[
                1 : num_top_products + 1
            ]  # start with 1 to Exclude the product itself
            similar_products = [all_products[idx] for idx in similar_product_indices]

            top_similar_products.append(
                {
                    "user_product": favorite_products[i],
                    "similar_products": similar_products,
                }
            )

        list_prodects = []
        for similar_products in top_similar_products:
            for similar_product in similar_products["similar_products"]:
                product_dict = {
                    "name": similar_product["name"],
                    "id": str(similar_product["_id"]),  # Convert ObjectId to string
                }
                list_prodects.append(product_dict)

        return list_prodects

    except Exception as e:
        print(f"Error: {str(e)}")
        return []
