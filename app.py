from flask import Flask, render_template, jsonify, request

app = Flask(__name__)


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/api/contact", methods=["POST"])
def contact():
    data = request.get_json()
    name = data.get("name", "")
    email = data.get("email", "")
    message = data.get("message", "")

    if not all([name, email, message]):
        return jsonify({"status": "error", "message": "All fields are required."}), 400

    # In production, send email or store in DB
    print(f"Contact form: {name} <{email}>: {message}")
    return jsonify({"status": "success", "message": "Thank you! We'll be in touch."})


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
