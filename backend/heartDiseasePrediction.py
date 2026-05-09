from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, precision_score, recall_score
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
import joblib
import pandas as pd
import numpy as np

df = pd.read_csv('heart_disease_uci.csv')

# ................... cleaning the dataset ........................

df = df.drop('dataset', axis=1)
df= df.drop('id', axis=1)
df['trestbps'] = df['trestbps'].fillna(df['trestbps'].mean())
df['chol'] = df['chol'].fillna(df['chol'].mean())
df = df.dropna(subset='restecg')
df['thalch'] = df['thalch'].fillna(df['thalch'].mean())
df['oldpeak'] = df['oldpeak'].fillna(df['oldpeak'].mean())
df['ca'] = df['ca'].fillna(df['ca'].mean())

df['fbs'] = df['fbs'].fillna(df['fbs'].mode()[0])


df['exang'] = df['exang'].fillna(df['exang'].mode()[0])


df['slope'] = df['slope'].fillna(df['slope'].mode()[0])
df['thal'] = df['thal'].fillna(df['thal'].mode()[0])


df['num'] = df['num'].apply(lambda x: 0 if x == 0 else 1)


# print(df.shape)
# print(df.head())
print(df.info())
# print(df.isna().sum())

x= df.drop('num', axis= 1)
y = df['num']

print(df['exang'].unique())
print(type(df['exang'][0]))

#  test train split
x_train, x_test , y_train , y_test = train_test_split( 
    x , y , random_state= 42 , test_size= 0.2)


numberFeatures = ['age', 'trestbps', 'chol', 'thalch', 'oldpeak', 'ca']
binaryFeature= ['fbs', 'exang']
stringFeature = ['sex','cp', 'restecg', 'slope', 'thal']



preprocessor = ColumnTransformer(
    transformers=[
        ('number', StandardScaler(), numberFeatures),
        ('bin', 'passthrough', binaryFeature),
        ('cat', OneHotEncoder(), stringFeature)
    ]
)


# # ............  making the model .......... 
model  = Pipeline(steps=[
    ('preprocessor', preprocessor),
    ('classifier', LogisticRegression(max_iter=1000))
])
# # model = RandomForestClassifier( n_estimators= 100,max_depth=5,min_samples_split=10, random_state= 42)
# # model =RandomForestClassifier(
# #     n_estimators=150,
# #     max_depth=6,
# #     min_samples_split=10,
# #     min_samples_leaf=4,
# #     random_state=42
# # )

# # model = GradientBoostingClassifier(random_state=42)
# model.fit(x_train , y_train)


# # .........................  saving the model................
# joblib.dump(model, 'heartPipelineModel.joblib')



# # ..................................training data
# y_predTrain = model.predict(x_train)

#  # ..................................testing data
# y_predTest = model.predict(x_test)


# #  ,,,,,,,,,,,,,,,,,,,, accuracy checking ,,,,,,,
# accuracyTrainScore = accuracy_score(y_train , y_predTrain)
# print( 'Accuracy for Training Data: ' , accuracyTrainScore)

# accuracyTestScore = accuracy_score(y_test , y_predTest)
# print('Accuracy for Testing Data: ' , accuracyTestScore)

# # print(df['num'].value_counts())
# testPrecision = precision_score(y_test , y_predTest)
# print('Precision for Test Data: ', testPrecision)

# testRecall = recall_score(y_test , y_predTest)
# print('Recall for Test Data: ', testRecall)

