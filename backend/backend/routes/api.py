from flask import Blueprint, jsonify, request
import pandas as pd
import os

api_bp = Blueprint('api', __name__)

DATA_PATH = os.path.join(os.path.dirname(__file__), '..', 'data', 'netflix_titles.csv')

df = pd.read_csv(DATA_PATH)
df['date_added'] = pd.to_datetime(df['date_added'], errors='coerce')

@api_bp.route('/titles', methods=['GET'])
def get_all_titles():
    limit = int(request.args.get('limit', 100))
    return jsonify(df.head(limit).to_dict(orient='records'))

@api_bp.route('/stats', methods=['GET'])
def get_stats():
    stats = {
        'total_titles': len(df),
        'total_movies': int((df['type'] == 'Movie').sum()),
        'total_tv_shows': int((df['type'] == 'TV Show').sum()),
        'oldest_year': int(df['release_year'].min()),
        'newest_year': int(df['release_year'].max())
    }
    return jsonify(stats)

@api_bp.route('/countries', methods=['GET'])
def get_country_counts():
    country_series = df['country'].dropna().str.split(', ', expand=True).stack()
    country_counts = country_series.value_counts().head(10)
    return jsonify(country_counts.to_dict())

@api_bp.route('/year/<int:year>', methods=['GET'])
def get_titles_by_year(year):
    filtered = df[df['release_year'] == year]
    return jsonify(filtered.to_dict(orient='records'))

@api_bp.route('/search', methods=['GET'])
def search_titles():
    query = request.args.get('q', '').lower()
    filtered = df[df['title'].str.lower().str.contains(query)]
    return jsonify(filtered.to_dict(orient='records'))
