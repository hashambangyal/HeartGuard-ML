from flask import Flask , request , jsonify 
from flask_cors import CORS
import joblib
import numpy as np
import pandas as pd

# flask app
app = Flask(__name__)
CORS(app)

model = joblib.load('heartPipelineModel.joblib')


@app.route('/')
def home():
    return 'API Running'

@app.route('/predict', methods=['POST'])
def perdict():

    data = request.json
    df = pd.DataFrame([data])

    pred = model.predict(df)

    return jsonify({
        'PredictedPrice': float(pred[0])
    })

if __name__ == '__main__':
   app.run(debug=True)