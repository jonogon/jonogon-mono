## Docker with WSL Setup

### Prerequisites:

- **Windows 10 (version 1903 or later) or Windows 11**
- **WSL 2 enabled:**

  1. Open PowerShell as administrator.
  2. Run `wsl --supported` to verify compatibility.
  3. If compatible, enable WSL 2 with: `wsl --set-default-version 2`

### Installation Steps:

1. **Install WSL 2 (if not already installed):**

   - Follow this YouTube tutorial: [https://youtu.be/eId6K8d0v6o](https://youtu.be/eId6K8d0v6o)
   - If Ubuntu is not installed for WSL, Run ```wsl --install --d Ubuntu``` to install it.

2. **Install Docker Desktop:**

   - Download and install the latest stable version of Docker Desktop from: [https://docs.docker.com/desktop/install/windows-install/](https://docs.docker.com/desktop/install/windows-install/)
   - During installation, ensure "Enable WSL 2 backend" is selected.

### Enabling WSL Integration in Docker Desktop:
1. Open terminal and switch to Ubuntu. ![Switching to Ubuntu](https://i.ibb.co/gtf7tMG/image.png)
2. Open Docker Desktop (has to be running in the background). 
3. Go to **Settings** > **General**.<br> ![Go to Settings](https://i.ibb.co/8D64v3z/image.png)
4. Under "WSL Integration," enable "Enable WSL 2 backend" (if not already enabled). ![Enable WSL 2 Backend](https://i.ibb.co/m6hfgDW/image.png) ![Enable Ubuntu from Resources > WSL integation](https://i.ibb.co/wc8sPg4/image.png)
5. If you have multiple WSL distributions, select your preferred one under "WSL Integation."
6. Now you can run everything from [Quick Start Guide](#quick-start) inside the Ubuntu console we opened in **Step #1**.

### Additional Notes:

- For advanced usage or troubleshooting, refer to the official Docker documentation on WSL integration: [https://docs.docker.com/go/wsl2/](https://docs.docker.com/go/wsl2/)