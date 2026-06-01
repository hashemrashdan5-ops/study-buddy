@echo off
chcp 65001 >nul
setlocal EnableDelayedExpansion

set "D=%USERPROFILE%\Desktop"

echo ====================================
echo     ترتيب الديسكتوب - StudyPro
echo ====================================
echo.

:: ── إنشاء المجلدات الرئيسية ──
if not exist "%D%\المشاريع"   mkdir "%D%\المشاريع"
if not exist "%D%\الوسائط"    mkdir "%D%\الوسائط"
if not exist "%D%\ملفات"      mkdir "%D%\ملفات"

:: ── المشاريع ──
echo [+] تنظيم المشاريع...
for %%F in (
    "my_app"
    "Lumivex_App"
    "hashem"
    "ستدي بدي مشروع"
    "build_lumivex"
    "Lumivex_Setup"
    "Lumivex_Se"
    "سولد"
    "hashem level 3"
    "TF"
) do (
    if exist "%D%\%%~F" (
        move /Y "%D%\%%~F" "%D%\المشاريع\" >nul 2>&1
        echo    نقلت: %%~F
    )
)

:: نقل كل مجلد Cinematic
for /D %%F in ("%D%\Cinematic_*") do (
    move /Y "%%F" "%D%\المشاريع\" >nul 2>&1
    echo    نقلت: %%~nxF
)

:: ── الوسائط (موسيقى + فيديو + صور) ──
echo [+] تنظيم الوسائط...
for %%F in (
    "فيديو"
    "الموسيقة"
    "شعار الشركة"
) do (
    if exist "%D%\%%~F" (
        move /Y "%D%\%%~F" "%D%\الوسائط\" >nul 2>&1
        echo    نقلت: %%~F
    )
)

:: ملفات MP3
for %%F in ("%D%\*.mp3") do (
    move /Y "%%F" "%D%\الوسائط\" >nul 2>&1
    echo    نقلت: %%~nxF
)

:: ملفات video bat
for %%F in ("%D%\run_video*") do (
    move /Y "%%F" "%D%\الوسائط\" >nul 2>&1
    echo    نقلت: %%~nxF
)

:: ملفات videoplayback
for %%F in ("%D%\videoplay*") do (
    move /Y "%%F" "%D%\الوسائط\" >nul 2>&1
    echo    نقلت: %%~nxF
)

:: ── ملفات متفرقة ──
echo [+] تنظيم الملفات المتفرقة...
for %%F in ("%D%\*.txt") do (
    move /Y "%%F" "%D%\ملفات\" >nul 2>&1
    echo    نقلت: %%~nxF
)
for %%F in ("MSI_Boost*") do (
    if exist "%D%\%%~F" (
        move /Y "%D%\%%~F" "%D%\ملفات\" >nul 2>&1
        echo    نقلت: %%~F
    )
)

echo.
echo ====================================
echo  تم الترتيب!
echo  - المشاريع   : مشاريع البرمجة
echo  - الوسائط    : موسيقى / فيديو / صور
echo  - ملفات      : ملفات متفرقة
echo ====================================
echo.
pause
