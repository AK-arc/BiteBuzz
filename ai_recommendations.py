import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

# Sample restaurant dataset
data = {'Restaurant': ['Sushi House', 'Burger Mania', 'Pasta Palace'],
        'Cuisines': ['Japanese Sushi', 'American Fast Food', 'Italian Pasta'],
        'Tags': ['Fresh fish, traditional', 'Grilled, fast, cheesy', 'Authentic, homemade, creamy']}

df = pd.DataFrame(data)

# Convert text features into numerical form
vectorizer = TfidfVectorizer(stop_words='english')
tfidf_matrix = vectorizer.fit_transform(df['Tags'])

# Compute similarity scores
similarity_matrix = cosine_similarity(tfidf_matrix, tfidf_matrix)

# Recommendation function
def recommend_restaurants(restaurant_name, top_n=2):
    index = df[df['Restaurant'] == restaurant_name].index[0]
    scores = list(enumerate(similarity_matrix[index]))
    scores = sorted(scores, key=lambda x: x[1], reverse=True)[1:top_n+1]
    return [df.iloc[i[0]]['Restaurant'] for i in scores]

# Example usage
print(recommend_restaurants('Sushi House'))
