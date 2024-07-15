import pprint
from flask import Blueprint, jsonify
import arabic_reshaper
from bidi.algorithm import get_display
from recommender.content_based import recommend_similar_products

recommendation_bp = Blueprint("recommendation_bp", __name__)


@recommendation_bp.route("/get-recommended/<user_id>", methods=["GET"])
def recommendations(user_id):
    recommendations = recommend_similar_products(user_id)

    converted_list = []
    for product in recommendations:
        reshaped_text = arabic_reshaper.reshape(product["name"])
        bidi_text = get_display(reshaped_text)
        product["name"] = bidi_text
        converted_list.append(product)
    pprint.pp(converted_list)
    return jsonify(converted_list)
