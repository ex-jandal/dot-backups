function enable-shizuku --wraps='adb shell sh /sdcard/Android/data/moe.shizuku.privileged.api/start.sh' --description 'alias enable-shizuku adb shell sh /sdcard/Android/data/moe.shizuku.privileged.api/start.sh'
  adb shell sh /sdcard/Android/data/moe.shizuku.privileged.api/start.sh $argv
        
end
