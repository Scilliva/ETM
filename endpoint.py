import json
from flask import Flask, request, jsonify, send_from_directory, render_template
import hashlib
import re
import mimetypes
mimetypes.add_type('text/css', '.css')
mimetypes.add_type('application/javascript', ".js")
from flask_cors import CORS
import json, time, uuid
base_folder="./public"
#scaler, mlp_clf, merged, yvar, columns = get_artifacts_from_config()

app = Flask(__name__, static_url_path="",static_folder='server/static',
            template_folder='server/templates')
CORS(app)

from firebase_admin import credentials, firestore, initialize_app

cred = credentials.Certificate("config/jci-luxembourg-firebase-adminsdk-b1oso-8d04fcd5dc.json")
default_app = initialize_app(cred)
db = firestore.client()
app_db = db.collection('llc')


@app.route('/predict', methods=['POST'])
def predict():
     
     json_ = request.json

     a = json.dumps(json_, sort_keys = True).encode("utf-8")
     seed = hashlib.md5(a).hexdigest()
     df = {}
     return jsonify({'path': seed, 'df':df})


@app.route('/media/<path:sim_id>')
def send_media(sim_id):
    sim_id = re.sub('[\W_]+', '', sim_id)
    return send_from_directory( "{}/media/{}".format(base_folder,sim_id),"media.png")


@app.route('/area/<path:sim_id>')
def send_area(sim_id):
    sim_id = re.sub('[\W_]+', '', sim_id)
    return send_from_directory( "{}/area/{}".format(base_folder,sim_id),"area.csv")

@app.route('/game/<path:sim_id>')
def send_game(sim_id):
    sim_id = re.sub('[\W_]+', '', sim_id)
    return render_template('{}/index.html'.format(sim_id))

@app.route('/event/<path:event_id>')
def send_event(event_id):
    #event_id = re.sub('[\W_]+', '', event_id)
    event = event_id.split("_")
    #event format TYPE_GAME_DETAILS

    # data to save
    data = {
        "type": event[0],
        "game": event[1],
        "params": event[2:],
        "time":time.time()
    }
    id = str(uuid.uuid4().fields[-1]) #"{}_{}_{}".format(data.get("time"),data.get("type"),data.get("game"))
    app_db.document(id).set(data)
    return jsonify({"success": True}), 200

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def catch_all(path):
    return 'You want path: %s' % path
     
if __name__ == '__main__':
    app.debug = True
    app.run(host='127.0.0.1', port=80)



"""
files_paths = []
for root, dirs, files in os.walk("./imgs"):
    path = root.split(os.sep)
    print((len(path) - 1) * '---', os.path.basename(root))
    for file in files:
        print(len(path) * '---', file)
        if ".pt" not in file:
            files_paths.append([os.path.basename(root), file])

"""
