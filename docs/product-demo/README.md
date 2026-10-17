# Teacher Training Tracker product demos

Short standalone overview videos:

- `teacher-training-tracker-demo-english.mp4` — English voiceover (Indian English)
- `teacher-training-tracker-demo-hindi.mp4` — Hindi voiceover
- Matching `.srt` files provide captions for each video.

Expanded module walkthroughs:

- `teacher-training-tracker-modules-english.mp4` — English walkthrough (Indian English voiceover)
- `teacher-training-tracker-modules-hindi.mp4` — Hindi walkthrough
- Matching `.srt` files provide sentence-level captions for each video.

The expanded walkthrough covers Admin dashboard, project and training plans, batch upload, reports, Trainer workspace, participant registration and attendance, content library, Trainee learning, assessment, feedback, certificates, and the role-based journey. Its screen panels are designed visuals based on the actual prototype's module names, navigation, styling, and documented flows; they are not live browser captures. The demo data is illustrative, and the application is a browser-based prototype.

To regenerate the original short overview on Windows, install Python packages `Pillow`, `edge-tts`, and `imageio-ffmpeg`, then run:

```powershell
python docs\product-demo\build_product_demo.py
```

To regenerate the expanded walkthroughs, run:

```powershell
python docs\product-demo\build_expanded_demo.py
```

Pass `english` or `hindi` to render one language only. The scripts use Microsoft neural voices and send only the relevant demo narration text to the speech service. They recreate the corresponding MP4 and subtitle files in this folder.

Published video page: https://shanku09-design.github.io/TeacherTrainingDashboard/docs/product-demo/
