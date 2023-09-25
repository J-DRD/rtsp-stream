#!/bin/zsh

# 🚀 Starting the setup...
# ✅ Echoing the success message
echo "🎉 Looks like everything works as expected!"

# 📝 Adding the current directory to the global git config as a safe directory
# git config --global --add safe.directory $(pwd)
# echo "📍 Current directory added to global git config as safe!"

# 🔧 Adjusting yarn config: Disabling telemetry for yarn home
yarn config set --home enableTelemetry 0
echo "🔒 Yarn telemetry disabled!"

# 📦 Installing dependencies using yarn
yarn install
echo "📦 Dependencies installed successfully!"

# 🎊 Setup complete!
echo "🎊 All set! Your environment is now ready!"
  