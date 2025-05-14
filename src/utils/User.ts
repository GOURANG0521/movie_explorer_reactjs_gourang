import axios from 'axios';
// const BASE_URL = 'https://movie-explorer-ror-aalekh-2ewg.onrender.com';
const BASE_URL = 'https://movie-explorer-ror-abhinav.onrender.com';

export const emailRegex: RegExp = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
export const passwordRegex: RegExp = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
export const phoneRegex: RegExp = /^\d{10}$/;

interface LoginResponse {
  message: string;
  token: string;
  name: string;
  email: string;
  mobile_number: string;
  role: string;
}

interface LoginPayload {
  user: {
    email: string;
    password: string;
  };
}

export const loginUser = async (email: string, password: string): Promise<LoginResponse> => {
  const payload: LoginPayload = {
    user: {
      email,
      password,
    },
  };

  try {
    const response = await axios.post(`${BASE_URL}/users/sign_in`, payload, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });

    const token = response.data.token;

    if (response.status === 200 && response.data) {
      console.log("login response", response.data);

      const userData: LoginResponse = {
        ...response.data,
        token,
        role: response.data.role || 'user',
      };
      console.log("token while login", token);
      localStorage.setItem("token", response?.data?.token);
      localStorage.setItem("new user detail", JSON.stringify(response.data));
      return userData;
    } else {
      throw new Error(response.data?.message || 'Invalid email or password');
    }
  } catch (error: any) {
    console.error('Sign-in failed:', error);
    throw new Error(error.response?.data?.message || 'An error occurred during login. Please try again.');
  }
};

interface SignUpResponse {
  message: string;
  token: string;
  name: string;
  email: string;
  mobile_number: string;
  role: string;
}

interface SignUpPayload {
  user: {
    name: string;
    email: string;
    password: string;
    mobile_number: string;
  };
}

export const signUpUser = async (payload: SignUpPayload): Promise<SignUpResponse> => {
  try {
    const response = await fetch(`${BASE_URL}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      const data: SignUpResponse = await response.json();
      console.log("login response", data);
      return data;
    } else {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Signup failed. Please try again.');
    }
  } catch (error) {
    console.error('Signup error:', error);
    throw new Error('An error occurred during signup. Please try again.');
  }
};

export interface Episode {
  id: number;
  title: string;
  desc: string;
  image: string;
  banner?: string;
  starRating: number;
  year: number;
  duration: string;
  genre?: string;
  director?: string;
  main_lead?: string;
  streaming_platform?: string;
  premium?: boolean;
  languages?: string;
  subtitles?: string;
}

export const fetchMovies = async (): Promise<Episode[]> => {
  try {
    const response = await fetch(`${BASE_URL}/api/v1/movies?per_page=100`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch movies: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('API Response:', data);

    let movies: any[] = [];
    if (data) {
      movies = data.movies;
    } else {
      throw new Error('error during fetching');
    }

    return movies.map((movie: any) => ({
      id: movie.id || 0,
      title: movie.title || 'Unknown Title',
      desc: movie.description || 'No description available',
      image: movie.poster_url || '',
      starRating: movie.rating || 0,
      year: movie.release_year || 0,
      duration: movie.duration ? `${movie.duration} min` : 'N/A',
      genre: movie.genre || 'N/A',
      director: movie.director || 'N/A',
      main_lead: movie.main_lead || 'N/A',
      streaming_platform: movie.streaming_platform || 'N/A',
      languages: movie.languages || 'N/A',
      subtitles: movie.subtitles || 'N/A',
    }));
  } catch (error) {
    console.error('Error fetching movies:', error);
    return [];
  }
};


export const fetchMovieById = async (id: number): Promise<Episode | null> => {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      window.location.href = '/';
      return null;
    }

    
    const planType = localStorage.getItem('plan type');

     

    const response = await fetch(`${BASE_URL}/api/v1/movies/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch movie: ${response.statusText}`);
    }


    const movie = await response.json();
    console.log('Single Movie Response:', movie);
    if (movie.premium && planType !== 'premium') {
      window.location.href = '/sub';
      return null;
    }

    if (!movie) {
      throw new Error('No movie data returned');
    }

    return {
      id: movie.id || 0,
      title: movie.title || 'Unknown Title',
      desc: movie.description || 'No description available',
      image: movie.poster_url || '',
      banner: movie.banner_url || '',
      starRating: movie.rating || 0,
      year: movie.release_year || 0,
      duration: movie.duration ? `${movie.duration} min` : 'N/A',
      genre: movie.genre || 'N/A',
      director: movie.director || 'N/A',
      main_lead: movie.main_lead || 'N/A',
      streaming_platform: movie.streaming_platform || 'N/A',
      languages: movie.languages || 'N/A',
      subtitles: movie.subtitles || 'N/A',
    };
  } catch (error) {
    console.error('Error fetching movie by ID:', error);
    return null;
  }
};


interface Movie {
  id: number;
  title: string;
  genre: string;
  description: string;
  director: string;
  duration: number;
  main_lead: string;
  poster_url: string;
  banner_url: string;
  premium: boolean;
  rating: number;
  release_year: number;
  streaming_platform: string;
}

export const getMoviesByGenre = async (genre: string): Promise<Movie[]> => {
  try {
    const response = await axios.get(`${BASE_URL}/api/v1/movies`, {
      params: {
        genre,
      },
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    const movies: Movie[] = response.data.movies || [];
    console.log(`Fetched movies for genre ${genre}:`, movies);
    return movies;
  } catch (error: any) {
    console.error(`Error fetching movies for genre ${genre}:`, error.message);
    return [];
  }
};

interface MovieFormData {
  title: string;
  genre: string;
  releaseYear: string;
  director: string;
  duration: string;
  description: string;
  mainLead: string;
  streamingPlatform: string;
  rating: string;
  poster: File | null;
  banner: File | null;
  isPremium: boolean;
}

export const createMovie = async (formData: MovieFormData): Promise<Movie | null> => {
  try {
    const token = localStorage.getItem("token");
    console.log("Retrieved token:", token);
    if (!token) {
      console.error("You need to sign in first.");
      throw new Error("No authentication token found");
    }

    const movieFormData = new FormData();
    movieFormData.append("movie[title]", formData.title);
    movieFormData.append("movie[genre]", formData.genre);
    movieFormData.append("movie[release_year]", formData.releaseYear);
    movieFormData.append("movie[director]", formData.director);
    movieFormData.append("movie[duration]", formData.duration);
    movieFormData.append("movie[description]", formData.description);
    movieFormData.append("movie[main_lead]", formData.mainLead);
    movieFormData.append("movie[streaming_platform]", formData.streamingPlatform);
    movieFormData.append("movie[rating]", formData.rating);
    movieFormData.append("movie[premium]", String(formData.isPremium));
    if (formData.poster) {
      movieFormData.append("movie[poster]", formData.poster);
    }
    if (formData.banner) {
      movieFormData.append("movie[banner]", formData.banner);
    }

    const response = await axios.post(`${BASE_URL}/api/v1/movies`, movieFormData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
        Accept: "application/json",
      },
    });

    const movie: Movie = response.data.movie;
    console.log("Movie created successfully:", movie);
    return movie;
  } catch (error: any) {
    console.error("Error creating movie:", error.message, error.response?.data);
    const errorMessage = error.response?.data?.error || "Failed to create movie";
    console.error(errorMessage);
    return null;
  }
};

export const getMoviesByGenrePage = async (
  genre: string,
  page: number = 1,
  perPage: number = 10
): Promise<{ movies: Movie[]; total: number }> => {
  try {
    const response = await fetch(
      `${BASE_URL}/api/v1/movies?genre=${genre}&page=${page}&per_page=${perPage}`
    );
    if (!response.ok) {
      throw new Error(`Failed to fetch ${genre} movies: ${response.statusText}`);
    }
    const data = await response.json();
    console.log(`API response for ${genre}, page ${page}:`, data);

    return {
      movies: data.movies,
      total: data.pagination?.total_pages || 1,
    };
  } catch (error) {
    console.error(`Error fetching ${genre} movies:`, error);
    return { movies: [], total: 0 };
  }
};

interface MovieResponse {
  movies: Movie[];
}

export const searchMoviesByTitle = async (title: string = ''): Promise<MovieResponse> => {
  try {
    const response = await axios.get(`${BASE_URL}/api/v1/movies`, {
      params: {
        title: title.trim() || undefined,
      },
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    const movieData: MovieResponse = {
      movies: response.data.movies || [],
    };

    return movieData;
  } catch (error) {
    console.error('Error fetching movies:', error);
    throw new Error('Failed to fetch movies');
  }
};

export const updateMovie = async (id: number, formData: MovieFormData): Promise<Movie | null> => {
  try {
    const token = localStorage.getItem("token");
    console.log("Retrieved token:", token);
    if (!token) {
      throw new Error("No authentication token found");
    }

    const movieFormData = new FormData();
    movieFormData.append("movie[title]", formData.title);
    movieFormData.append("movie[genre]", formData.genre);
    movieFormData.append("movie[release_year]", formData.releaseYear);
    movieFormData.append("movie[director]", formData.director);
    movieFormData.append("movie[duration]", formData.duration);
    movieFormData.append("movie[description]", formData.description);
    movieFormData.append("movie[main_lead]", formData.mainLead);
    movieFormData.append("movie[streaming_platform]", formData.streamingPlatform);
    movieFormData.append("movie[rating]", formData.rating);
    movieFormData.append("movie[premium]", String(formData.isPremium));
    if (formData.poster) {
      movieFormData.append("movie[poster]", formData.poster);
    }
    if (formData.banner) {
      movieFormData.append("movie[banner]", formData.banner);
    }

    const response = await axios.patch(`${BASE_URL}/api/v1/movies/${id}`, movieFormData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
        Accept: "application/json",
      },
    });

    const movie: Movie = response.data.movie;
    console.log("Movie updated successfully:", movie);
    return movie;
  } catch (error: any) {
    console.error("Error updating movie:", error.message, error.response?.data);
    return null;
  }
};

export const deleteMovie = async (movieId: number): Promise<void> => {
  const token = localStorage.getItem('token');

  if (!token) {
    throw new Error('Authentication token not found');
  }

  try {
    await axios.delete(`${BASE_URL}/api/v1/movies/${movieId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });
  } catch (error) {
    console.error('Error deleting movie:', error);
    throw error;
  }
};

export const signOut = async (): Promise<void> => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No token found');
    }

    const response = await fetch(`${BASE_URL}/users/sign_out`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (response.ok) {
      localStorage.removeItem('new user detail');
      localStorage.removeItem('token');
      localStorage.removeItem('plan type');
    }

    localStorage.removeItem('user');
    localStorage.removeItem('token');
  } catch (error) {
    console.error('Sign-out error:', error);
    throw error;
  }
};

export const fetchMoviesforgener = async (genre: string): Promise<Episode[]> => {
  const apiUrls: { [key: string]: string } = {
    Action: `${BASE_URL}/api/v1/movies?genre=Action`,
    Thriller: `${BASE_URL}/api/v1/movies?genre=Thriller`,
    'Si-Fi': `${BASE_URL}/api/v1/movies?genre=Si-Fi`,
  };

  const url = apiUrls[genre];
  if (!url) {
    throw new Error('Invalid genre');
  }

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch movies for genre: ${genre}`);
    }
    const data = await response.json();
    const movies = Array.isArray(data) ? data : data.movies || [];

    return movies.map((movie: any) => ({
      id: movie.id,
      title: movie.title,
      desc: movie.description || movie.desc || 'No description available',
      image: movie.poster_url || movie.image,
      starRating: movie.rating || movie.starRating || 0,
      year: movie.release_year || movie.year || 0,
      duration: movie.duration ? `${movie.duration} min` : movie.duration || 'N/A',
      streaming_platform: movie.streaming_platform || 'N/A',
      premium:movie.premium,
    }));
  } catch (error) {
    console.error(`Error fetching movies for genre ${genre}:`, error);
    throw error;
  }
};

interface UserData {
  token?: string;
}

interface ApiErrorResponse {
  message?: string;
}

export const sendTokenToBackend = async (token: string): Promise<any> => {
  try {
    const userData = localStorage.getItem('new user detail');
    if (!userData) {
      throw new Error('No user data found. User might not be logged in.');
    }

    const user: UserData = JSON.parse(userData);
    const authToken = user?.token;
    if (!authToken) {
      throw new Error('No authentication token found in user data.');
    }

    console.log('Sending FCM token to backend:', token);
    console.log('Using auth token:', authToken);

    const response = await fetch(`${BASE_URL}/api/v1/update_device_token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      },
      body: JSON.stringify({ device_token: token }),
    });

    if (!response.ok) {
      const errorData: ApiErrorResponse = await response.json().catch(() => ({}));
      throw new Error(`Failed to send device token: ${response.status} ${response.statusText} - ${errorData.message || 'Unknown error'}`);
    }

    const data = await response.json();
    console.log('Device token sent to backend successfully:', data);
    return data;
  } catch (error) {
    console.error('Error sending device token to backend:', error);
    throw error;
  }
};

export const toggleNotifications = async () => {
  try {
    const authToken = localStorage.getItem('token');

    const response = await axios.post(`${BASE_URL}/api/v1/toggle_notifications`, {
      notifications_enabled: true,
    }, {
      headers: {
        'Authorization': `Bearer ${authToken}`,
      },
    });
    console.log("RESPONSE FOR NOTIFICATIONS: ", response);
  } catch (error) {
    console.error('Error Accepting Notifications:', error);
    throw error;
  }
};

interface Plan {
  id: string;
  name: string;
  price: string;
  features: string[];
  duration: string;
  popular?: boolean;
}

interface PaymentResponse {
  success: boolean;
  error?: string;
}


export const createSubscription = async (planType: string): Promise<string> => {
  try {
    const token = localStorage.getItem("token");
    console.log("Retrieved token:", token);
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await axios.post(
      `${BASE_URL}/api/v1/subscriptions`,
      { plan_type: planType },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log('API Response:', response.data);

    if (response.data.error) {
      throw new Error(response.data.error);
    }

    const checkoutUrl = response.data.checkoutUrl || response.data.data?.checkoutUrl || response.data.url;
    if (!checkoutUrl) {
      throw new Error('No checkout URL returned from server.');
    }

    return checkoutUrl;
  } catch (error: any) {
    console.error('Error creating subscription:', error);
    throw new Error(error.message || 'Failed to initiate subscription');
  }
};

interface SubscriptionStatus {
    status: 'active' | 'inactive' | 'expired' | 'pending';
    plan_name?: string;
    price?: string;
    duration?: string;
    start_date?: string;
    end_date?: string;
  }
  
  interface ApiError {
    error: string;
  }

  interface SubscriptionStatus {
    plan_type: 'premium' | 'basic';
  }

export const getSubscriptionStatus = async (token: string): Promise<SubscriptionStatus> => {
  try {
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await axios.get(
      `${BASE_URL}/api/v1/subscriptions/status`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if ('error' in response.data) {
      throw new Error(response.data.error);
    }

    console.log("status checking ", response.data.plan_type);
    localStorage.setItem("plan type",response.data.plan_type);
    return response.data;
  } catch (error) {
    console.error('Subscription Status Error:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      response: axios.isAxiosError(error) ? error.response?.data : undefined,
      status: axios.isAxiosError(error) ? error.response?.status : undefined,
    });
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error || 'Failed to fetch subscription status');
    }
    throw new Error('An unexpected error occurred');
  }
};



export interface User {
  id: number;
  name: string;
  email: string;
  mobile_number: string;
  role: string;
}

export async function fetchCurrentUser(): Promise<User> {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.get<User>('https://movie-explorer-ror-abhinav.onrender.com/api/v1/current_user', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    if (error) {
      throw new Error(`Failed to fetch user data: ${error.response?.statusText || error.message}`);
    }
    throw new Error(`API error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}