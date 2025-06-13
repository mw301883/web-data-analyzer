from flask import Blueprint, jsonify, request
import pandas as pd
import os
from flask_jwt_extended import (
    jwt_required,
    verify_jwt_in_request
)

api_bp = Blueprint('api', __name__)

DATA_PATH = os.path.join(os.path.dirname(__file__), '..', 'data', 'netflix_titles.csv')

df = pd.read_csv(DATA_PATH)
df['date_added'] = pd.to_datetime(df['date_added'], errors='coerce')

df['country'] = df['country'].fillna('')
df['listed_in'] = df['listed_in'].fillna('')


def split_and_stack(series, sep=', '):
    return series.str.split(sep, expand=True).stack().str.strip()


def jwt_protect():
    try:
        verify_jwt_in_request()
    except Exception as e:
        return jsonify({"error": str(e)}), 401
    return None


@api_bp.route('/titles', methods=['GET'])
@jwt_required()
def get_all_titles():
    err = jwt_protect()
    if err:
        return err

    limit = int(request.args.get('limit', 50))
    offset = int(request.args.get('offset', 0))
    title_type = request.args.get('type')
    country_filter = request.args.get('country')
    year_filter = request.args.get('year', type=int)
    sort_by = request.args.get('sort_by', 'date_added')

    filtered = df.copy()

    if title_type in ['Movie', 'TV Show']:
        filtered = filtered[filtered['type'] == title_type]

    if country_filter:
        filtered = filtered[
            filtered['country'].apply(
                lambda x: country_filter.lower() in [c.strip().lower() for c in x.split(',')]
            )
    ]


    if year_filter:
        filtered = filtered[filtered['release_year'] == year_filter]

    if sort_by == 'release_year':
        filtered = filtered.sort_values(by='release_year', ascending=False)
    else:
        filtered = filtered.sort_values(by='date_added', ascending=False)

    sliced = filtered.iloc[offset:offset + limit]
    return jsonify({
        'count': len(filtered),
        'results': sliced.to_dict(orient='records')
    })


@api_bp.route('/stats', methods=['GET'])
@jwt_required()
def get_stats():
    err = jwt_protect()
    if err:
        return err

    releases_per_year = df.groupby('release_year').size().dropna().to_dict()

    df_recent = df[df['date_added'].notna()]
    df_recent = df_recent[df_recent['date_added'] >= pd.Timestamp.now() - pd.DateOffset(years=5)]
    added_per_month = df_recent.groupby(df_recent['date_added'].dt.to_period('M')).size()
    added_per_month = added_per_month.rename(lambda x: x.strftime('%Y-%m')).to_dict()

    genre_series = split_and_stack(df['listed_in'])
    top_genres = genre_series.value_counts().head(10).to_dict()

    stats = {
        'total_titles': len(df),
        'total_movies': int((df['type'] == 'Movie').sum()),
        'total_tv_shows': int((df['type'] == 'TV Show').sum()),
        'oldest_year': int(df['release_year'].min()),
        'newest_year': int(df['release_year'].max()),
        'releases_per_year': releases_per_year,
        'added_per_month': added_per_month,
        'top_genres': top_genres,
    }
    return jsonify(stats)


@api_bp.route('/countries', methods=['GET'])
@jwt_required()
def get_country_counts():
    err = jwt_protect()
    if err:
        return err

    country_series = split_and_stack(df['country'])
    country_counts = country_series.value_counts().head(10)
    total = len(df)
    country_stats = {
        country: {'count': count, 'percentage': round(count / total * 100, 2)}
        for country, count in country_counts.items()
    }
    return jsonify(country_stats)


@api_bp.route('/year/<int:year>', methods=['GET'])
@jwt_required()
def get_titles_by_year(year):
    err = jwt_protect()
    if err:
        return err

    filtered = df[df['release_year'] == year]

    type_counts = filtered['type'].value_counts().to_dict()
    genre_series = split_and_stack(filtered['listed_in'])
    top_genres = genre_series.value_counts().head(10).to_dict()

    return jsonify({
        'count': len(filtered),
        'type_counts': type_counts,
        'top_genres': top_genres,
        'titles': filtered.to_dict(orient='records'),
    })


@api_bp.route('/search', methods=['GET'])
@jwt_required()
def search_titles():
    err = jwt_protect()
    if err:
        return err

    query = request.args.get('q', '').lower()
    limit = int(request.args.get('limit', 50))
    offset = int(request.args.get('offset', 0))

    filtered = df[df['title'].str.lower().str.contains(query, na=False)]
    sliced = filtered.iloc[offset:offset + limit].copy()

    sliced['date_added'] = sliced['date_added'].astype(str)

    sanitized = sliced.where(pd.notnull(sanitized := sliced), None)

    return jsonify({
        'count': int(len(filtered)),
        'results': sanitized.to_dict(orient='records')
    })
