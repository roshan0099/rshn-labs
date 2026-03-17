import streamlit as st
import subprocess
import tempfile
import os

st.set_page_config(page_title="Pocket TTS Generator")
st.title("🎙️ Text to Speech Generator")

voices = {
    "Alba (Female - Casual)": "alba",
    "Marius (Male - Neutral)": "marius",
    "Javert (Male - Deep)": "javert",
    "Jean (Male - Authoritative)": "jean",
    "Fantine (Female - Soft)": "fantine",
    "Cosette (Female - Light)": "cosette",
    "Eponine (Female - Expressive)": "eponine",
    "Azelma (Female - Dynamic)": "azelma"
}

voice_label = st.selectbox("Choose Voice", list(voices.keys()))
voice = voices[voice_label]

text_input = st.text_area("Enter Text", height=200)

if st.button("Generate Audio"):
    if not text_input.strip():
        st.warning("Please enter text.")
    else:
        with st.spinner("Generating..."):

            output_file = "tts_output.wav"

            command = [
                "pocket-tts",
                "generate",
                "--text", text_input,
                "--voice", voice
            ]

            subprocess.run(command)

        if os.path.exists(output_file):
            st.success("Audio generated!")
            st.audio(output_file)
            st.download_button(
                "Download Audio",
                open(output_file, "rb"),
                file_name="tts_output.wav"
            )
        else:
            st.error("Audio file not found. Check terminal for errors.")