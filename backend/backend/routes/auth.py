from flask import Blueprint, request, jsonify
from passlib.hash import bcrypt
from flask_jwt_extended import (
    create_access_token
)
from backend.db import get_users_collection

auth_bp = Blueprint('auth', __name__)

# TODO optionally add register panel
@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    users = get_users_collection()

    if users.find_one({'username': username}):
        return jsonify({'error': 'User already exists'}), 409

    hashed_pw = bcrypt.hash(password)
    users.insert_one({'username': username, 'password': hashed_pw})
    return jsonify({'message': 'User created'}), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    users = get_users_collection()
    user = users.find_one({'username': username})
    if not user or not bcrypt.verify(password, user['password']):
        return jsonify({'error': 'Invalid credentials'}), 401

    access_token = create_access_token(identity=username)
    return jsonify({'access_token': access_token})
