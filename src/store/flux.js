import React, { useContext, useState, useEffect } from "react";

const getState = ({ getStore, getActions, setStore }) => {
    return {
        store: {
            user_data: {
                userName: "",
                email: "",
                userPass: "",
                firstName: "",
                lastName: "",
                isAdmin: false,
                bio: "",
            },
            login_data: {
                userLogin: "",
                userPass: "",
            },
            logged_user: {
                userName: "",
                email: "",
                userPass: "",
                firstName: "",
                lastName: "",
                isAdmin: false,
                bio: "",
                auth_token: ""
            },
            success: false,
            movieList: [],
            movieDetails: {},
            user_favorites: [],
        },

        actions: {
            updateBio: (bio) => {
                const store = getStore();
                let { logged_user } = store;
                console.log(logged_user);
                logged_user.bio = bio;
                setStore({ logged_user });
                console.log(store.logged_user);
                console.log(store.logged_user.id);
                getActions().updateUser();
            },
            updateUser: async () => {
                const store = getStore();
                let options = {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${store.logged_user.auth_token}`,
                    },
                    body: JSON.stringify(store.logged_user),
                };
                const response = await fetch(
                    `http://127.0.0.1:5000/users/${store.logged_user.id}`,
                    options
                );
                const json = await response.json();
                console.log(json);
            },
            deleteUser: async (username) => {
                const store = getStore();
                let options = {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${store.logged_user.auth_token}`,
                    },
                };
                const response = await fetch(
                    `http://127.0.0.1:5000/users/${username}`,
                    options
                );
                const json = await response.json();
                console.log(json);
                setStore({ success: json.success });
                console.log(store.success);
            },
            onChangeUser: (evento) => {
                const store = getStore();
                const { user_data } = store;
                user_data[evento.target.name] = evento.target.value;
                setStore({ user_data });
                console.log(store.user_data);
            },
            onSignup: async () => {
                const store = getStore();
                let options = {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(store.user_data),
                };
                const response = await fetch(
                    "http://127.0.0.1:5000/signup",
                    options
                );
                const json = await response.json();
                console.log("--data--", json);
            },
            onChangeLogin: (evento) => {
                const store = getStore();
                const { login_data } = store;
                login_data[evento.target.name] = evento.target.value;
                setStore({ login_data });
                console.log(store.login_data);
            },
            onLogin: async () => {
                const store = getStore();
                let options = {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(store.login_data),
                };
                const response = await fetch(
                    "http://127.0.0.1:5000/login",
                    options
                );
                const json = await response.json();
                console.log("--data--", json);
                let { logged_user } = store;
                logged_user = { ...json.user };
                logged_user.auth_token = json.access_token;
                setStore({ logged_user });
                console.log(logged_user);
            },
            getMovieList: async (searchValue) => {
                console.log(searchValue);
                const response = await fetch(
                    `http://www.omdbapi.com?s=${searchValue}&type=movie&apikey=70240a7d`
                );
                const json = await response.json();
                console.log("--json--", json);
                let options = {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "User-Agent": "PostmanRuntime/7.26.8",
                        "Accept": "*/*",
                        "Accept-Encoding": "gzip, deflate, br",
                        "Connection": "keep-alive",
                        "Authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE2MDc3MzkxOTksIm5iZiI6MTYwNzczOTE5OSwianRpIjoiMjhlYWE2NGYtMWYzZC00NmNiLWE0ODgtNTNkMDJkODY3ZDgxIiwiZXhwIjoxNjA4MzQzOTk5LCJpZGVudGl0eSI6Im51ZXZvQGV4YW1wbGUuY29tIiwiZnJlc2giOmZhbHNlLCJ0eXBlIjoiYWNjZXNzIn0.rx3GMdI1ZXXnxjsh-1qW3bK8jIhBFREOUqAEeUCfZk8"
                    },
                };
                const response2 = await fetch(
                    `http://127.0.0.1:5000/rates_avgs`, options
                );
                const json2 = await response2.json();
                console.log("--json2--", json2);
                //setStore({ rates_avgs: json2.rates_avgs });
                for (var i = 0; i < json.Search.length; i++) {
                    for (var j = 0; j < json2.rates_avgs.length; j++) {
                        if (json2.rates_avgs[j].movie_id == json.Search[i].imdbID) {
                            json.Search[i].rate_avg = json2.rates_avgs[j].rate_avg;
                        }
                    }
                }
                setStore({ movieList: json.Search });
            },
            getMovieDetails: async (title) => {
                getActions().cleanMovieDetails();
                const response = await fetch(
                    `http://www.omdbapi.com?t=${title}&apikey=70240a7d`
                );
                const json = await response.json();
                console.log("--json--", json);
                setStore({ movieDetails: json });
            },
            cleanMovieDetails: () => {
                setStore({ movieDetails: {} });
            },

            setRating2: async (user_id, movie_id, rate) => {
                let options = {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "User-Agent": "PostmanRuntime/7.26.8",
                        "Accept": "*/*",
                        "Accept-Encoding": "gzip, deflate, br",
                        "Connection": "keep-alive",
                        "Authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE2MDc3MzkxOTksIm5iZiI6MTYwNzczOTE5OSwianRpIjoiMjhlYWE2NGYtMWYzZC00NmNiLWE0ODgtNTNkMDJkODY3ZDgxIiwiZXhwIjoxNjA4MzQzOTk5LCJpZGVudGl0eSI6Im51ZXZvQGV4YW1wbGUuY29tIiwiZnJlc2giOmZhbHNlLCJ0eXBlIjoiYWNjZXNzIn0.rx3GMdI1ZXXnxjsh-1qW3bK8jIhBFREOUqAEeUCfZk8"
                    },
                    body: JSON.stringify({ user_id: user_id, movie_id: movie_id, rate: rate })
                };

                const response = await fetch(
                    `http://127.0.0.1:5000/api/rate`
                    , options
                );
                const json = await response.json();
                console.log("--rate--", json);


            },
            addUserFavorites: async (user_id, movie_id) => {
                let options = {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "User-Agent": "PostmanRuntime/7.26.8",
                        "Accept": "*/*",
                        "Accept-Encoding": "gzip, deflate, br",
                        "Connection": "keep-alive",
                        "Authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE2MDc3MzkxOTksIm5iZiI6MTYwNzczOTE5OSwianRpIjoiMjhlYWE2NGYtMWYzZC00NmNiLWE0ODgtNTNkMDJkODY3ZDgxIiwiZXhwIjoxNjA4MzQzOTk5LCJpZGVudGl0eSI6Im51ZXZvQGV4YW1wbGUuY29tIiwiZnJlc2giOmZhbHNlLCJ0eXBlIjoiYWNjZXNzIn0.rx3GMdI1ZXXnxjsh-1qW3bK8jIhBFREOUqAEeUCfZk8"
                    },
                    body: JSON.stringify({   user_id: user_id, movie_id: movie_id})
                };

                const response = await fetch(
                    `http://127.0.0.1:5000/favorites`
                    , options
                );
                const json = await response.json();
                console.log("--favorites--", json);

            },

            showUserFavorites: async (id) => {
                console.log("luis");
                let options = {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "User-Agent": "PostmanRuntime/7.26.8",
                        "Accept": "*/*",
                        "Accept-Encoding": "gzip, deflate, br",
                        "Connection": "keep-alive",
                        "Authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE2MDc3MzkxOTksIm5iZiI6MTYwNzczOTE5OSwianRpIjoiMjhlYWE2NGYtMWYzZC00NmNiLWE0ODgtNTNkMDJkODY3ZDgxIiwiZXhwIjoxNjA4MzQzOTk5LCJpZGVudGl0eSI6Im51ZXZvQGV4YW1wbGUuY29tIiwiZnJlc2giOmZhbHNlLCJ0eXBlIjoiYWNjZXNzIn0.rx3GMdI1ZXXnxjsh-1qW3bK8jIhBFREOUqAEeUCfZk8"
                    },

                };

                const response = await fetch(
                    `http://127.0.0.1:5000/favorites/user/${id}`
                    , options
                );
                
                const json = await response.json();
                console.log("--favorites--", json);
                setStore({ userFavorites: json });

            },
            getMoviesbyId: async (movie_id) => {
                const response = await fetch(
                    `http://www.omdbapi.com/?i=${movie_id}7&apikey=70240a7d`
                );
                const json = await response.json();
                console.log("--Moviebyid--", json);
                setStore({ movieDetails: json });
            },
        }
    };
};

export default getState;
