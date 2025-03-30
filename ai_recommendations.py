import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

# Sample data with Tags column included
data = {
    'Restaurant': ['Sushi House', 'Burger Mania', 'Pasta Palace', 'Taco Fiesta'],
    'Cuisine': ['Japanese Sushi', 'American Fast Food', 'Italian Pasta', 'Mexican Tacos'],
    'Tags': ['Fresh fish, traditional', 'Grilled, fast, cheesy', 'Authentic, homemade, creamy', 'Spicy, crunchy, salsa']
}

# Create DataFrame
df = pd.DataFrame(data)

# Combine cuisine and tags for better recommendations
df['Combined_Info'] = df['Cuisine'] + " " + df['Tags']

# Convert text data into vectors using TF-IDF (better than CountVectorizer)
vectorizer = TfidfVectorizer(stop_words='english')
X = vectorizer.fit_transform(df['Combined_Info'])

# Compute cosine similarity
cosine_sim = cosine_similarity(X, X)


def recommend_restaurants(restaurant_name, top_n=3):
    """
    Recommends similar restaurants based on cuisine and tags.

    :param restaurant_name: The name of the restaurant to find similar ones
    :param top_n: Number of recommendations to return
    :return: List of recommended restaurants
    """
    # Check if the restaurant exists in the dataset
    if restaurant_name not in df['Restaurant'].values:
        return f"Error: '{restaurant_name}' not found in the dataset."

    # Get the index of the restaurant
    index = df[df['Restaurant'] == restaurant_name].index[0]

    # Get similarity scores for all restaurants
    similarity_scores = list(enumerate(cosine_sim[index]))

    # Sort restaurants by similarity score (excluding itself)
    sorted_scores = sorted(similarity_scores, key=lambda x: x[1], reverse=True)[1:top_n + 1]

    # Extract recommended restaurant names
    recommended_restaurants = [df.iloc[i[0]]['Restaurant'] for i in sorted_scores]

    return recommended_restaurants if recommended_restaurants else "No similar restaurants found."


# Example Usage
restaurant_to_search = "Sushi House"
recommendations = recommend_restaurants(restaurant_to_search, top_n=3)
print(f"Recommended restaurants for '{restaurant_to_search}': {recommendations}")

# Example output
Recommended restaurants for 'Sushi House': ['Taco Fiesta', 'Pasta Palace', 'Burger Mania']
