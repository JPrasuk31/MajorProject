
from openai import AzureOpenAI
from flask import Flask, request, jsonify
import json
from flask_cors import CORS

client = AzureOpenAI(
    api_key="b0f92af221a34bd5990340f1a3267ff2",
    api_version="2023-05-15",
    azure_endpoint = "https://dirogpt4.openai.azure.com/"
    )
deployment_name = "dirogpt8knov2023"


# client = AzureOpenAI(
#     api_key="28c1c0798dd146a5ae4c37404a74ea0a",
#     api_version="2023-05-15",
#     azure_endpoint = "https://diroai.openai.azure.com/"
# )
# deployment_name = 'gpt35'


app = Flask(__name__)
CORS(app)

@app.route('/gpt_response', methods=['POST'])
def interact_with_gpt():
    # return json.dumps({'gptResponse' : '{\"status\" : false, \"steps\" : [{\"action\": \"click\", \"id\": 32}] }'})
    # messages = [
    #     {"role": "system",
    #      "content": ''' 
    #         You are a psychiatrist who is expert in guessing when a person is being manipulated or not. You will be given a sample covno of two persons and your job is to tell wheteher any of the person is getting manipulated or not. While checking for manipulation do not give true for the minor signs and give true only if the strong sign of manipulation comes .Give me a JSON response and only JSON response no explanatnion with the keys    "manipulation"  : <It would specify true or false>   and "Person"  : <it would be the person name who is getting manipulated >  and "Technique" : <which technique of manipulation is used . Give a JSON response only and no explanations
    #      '''},
    # ]
    messages = [
        {"role": "system",
         "content": ''' 
         Is any person in the below conversation between two persons getting maniopulated give response in JSON. This is the sample eg. and JSON format 
  manipulation: true,
  manipulator: 'kartik',
  manipulated: 'prasuk',
  explanation: 'Kartik is trying to manipulate Prasuk into skipping classes to go to the movie by downplaying the importance of the classes and emphasizing the rarity of the tickets.',
}
         '''},
    ]
    data = request.get_json()
    print("Data recieved : ",data,"\n\n\n")
    # prompt = data["body"]
    prompt = str(data["chat"])
    message = {"role" : "user", "content" : prompt}
    messages.append(message)
    print(messages)
    response = client.chat.completions.create(model=deployment_name, messages=messages, max_tokens=1000,temperature=0.3)
    text = response.choices[0].message.content
    text = {'gptResponse' : text}
    # else:
    #     text = {'gptResponse' : "Token Count Exceeded"}
    text = json.dumps(text)
    print("GPT RESPONSE SENDING TO BACKGROUND : ", text) 
    return text, 200

app.run(port=8001 , host = "0.0.0.0",debug = True)