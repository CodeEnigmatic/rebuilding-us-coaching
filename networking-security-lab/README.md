# Fieldwork — networking and security lab

A free macOS lab with a browser companion and a real loopback HTTP service. Python standard library only. No installs, cloud accounts, virtual machines or credentials required. This directory is separate from the existing coaching application.

## Start

From the workspace root:

```sh
cd networking-security-lab
python3 serve.py
```

Open **http://127.0.0.1:8765** in your browser. Keep that Terminal running and use a second Terminal for lab commands. Start with **Map your laptop’s network**, then **Follow a real HTTP connection**. Stop both services with Ctrl+C.

Port 8765 serves only the `web` directory. Port 8766 is the practice target. Both bind to 127.0.0.1. If a port is occupied, stop your previous lab instance or choose another pair with `--port`; the written lab commands assume the default pair and must be adjusted if you change ports. Use the same browser and URL consistently: progress belongs to that browser origin.

## What you can practice now

1. Interface, addressing, gateway and DNS inventory.
2. TCP listeners, HTTP requests and status interpretation.
3. DNS success versus failure.
4. Subnet design, checked with Python `ipaddress`.
5. Denied versus accepted bearer-token access.
6. Event timelines and evidence-based incident notes.
7. SHA-256 integrity verification.
8. Application-failure triage against an intentional 503 route.

The dashboard never executes shell commands. Copy commands into Terminal yourself. Network configuration is read-only. The integrity exercise creates a tiny training text file in your current directory. The DNS exercise queries public DNS. Other service exercises target this laptop.

## Track learning

Save command observations, success-check evidence and explanations. Mark Practicing, Completed or Demonstrated and choose a review date. Completed and Demonstrated require evidence notes but remain self-assessments. Export JSON periodically; import validates records and merges them after confirmation. Browser storage is not a cloud backup. Service logs are capped at 200 events and reset when the server restarts.

## Exam scope

This is an initial practical curriculum, not full exam coverage. Network+ uses N10-009 domain themes; Security+ uses SY0-701 domain themes provisionally. Exact subobjective coverage and SY0-801 alignment are not yet verified. CompTIA’s Security+ page could not be retrieved during setup. An independently submitted event listing hosted by NIST reports SY0-801 expected around November 17, 2026; verify directly with CompTIA before choosing an exam version. Do not interpret this tracker as a pass prediction.

Sources:

- [Official N10-009 objectives](https://assets.ctfassets.net/82ripq7fjls2/113XqW3JHT7AlIU33M63I0/af42da2af7383a38f318bad10aa9afbd/Network_Plus_N10-009_Exam_Objectives.pdf)
- [CompTIA Security+](https://www.comptia.org/en-us/certifications/security/)
- [Exam transition event listing](https://www.nist.gov/nice/ccw-events/252831)
- [Apple network interface and packet trace documentation](https://developer.apple.com/documentation/Network/recording-a-packet-trace)

## Later expansion

The laptop had approximately 299 MB available when inspected. Avoid downloading VM images until disk space is available. This starter does not implement switches, VLAN enforcement, routed virtual networks or a Linux target. Those need later setup; a free ARM Linux VM can become the next stage once capacity is known. You can learn on the existing physical laptop now without buying hardware.

## Verification

```sh
python3 -B test_lab.py
node --check web/app.js
```

The test uses temporary ephemeral loopback ports, checks target statuses, authentication, logging, and dashboard serving, and stops its services afterward. No tests execute lab commands or modify network settings.


## Private network journal

The dashboard includes a manual network journal, dated snapshots, field comparisons, investigation notes, a JSON backup/restore flow and a plain-text report. Your reported baseline is prefilled from `private/baseline.json`; review it and save the first snapshot. It is dated as the observation, not the date of a live scan. This local file is excluded from Git and outside the static web directory. The loopback server exposes it through `/local-baseline.json` with cache disabled. This is local data handling, not encrypted storage or customer-grade access control.

Journal records use a separate browser-storage key from lab progress. Exports include private details: review them before sharing. The journal does not automatically mark any lab completed. Existing progress remains unchanged. Restart `serve.py` after updating the server to enable the baseline endpoint.

Additional checks: `node --test test_journal.mjs`.


## Progress and service health

Every lab shows its saved stage: Not started 0%, Practicing 33%, Completed 67%, Demonstrated 100%. Journal progress counts three milestones: first snapshot, a second snapshot of the same profile, and a saved investigation. Overall starter-path progress counts each of the eight labs as three stages, plus the three journal milestones. It is not an exam-readiness or professional-qualification score. Prefilled observations alone do not count as saved work.

The next-action panel follows a starter path: save baseline, complete labs, compare observations, document an investigation, repeat independently. Service health checks the dashboard and the practice target on loopback. It does not inspect external network connectivity, DNS, or security posture. It checks on page load and when you click Check again, showing a timestamp. Restart the Python server after updating to enable `/site-health`.

Progress model checks: `node --test test_progress.mjs`.


## Lesson task checklists

Every lesson has persistent checkboxes for experiment steps, success checks and the reflection answer. Toggling a task saves its flags immediately without saving or discarding other draft edits. Lesson and learning-path task meters count checked items; knowledge-stage meters remain separate. Legacy records without task flags start unchecked. Lab-progress JSON export/import includes task flags; older exports remain compatible. Checkbox completion does not automatically assign a knowledge stage or certify results.

Checks: `node --test test_checklist.mjs`.

## Small-office network simulator

Six browser-only fault scenarios cover DNS, DHCP pool exhaustion, default gateway configuration, AP access VLAN placement, guest firewall policy and modeled Wi-Fi channel contention. The workbench applies changes to a deterministic model and reports client observations. It sends no packets and changes no host configuration. Save a checkpoint before changing settings; rollback restores that applied configuration and clears test results.

Completion requires an applied change, successful current-configuration tests for staff-server access, external-IP access, DNS/web access and guest isolation, plus an explanation. Completed scenario evidence persists separately under `kyle-office-simulator-v1`; export includes saved records and the current run. Unfinished runs reset on reload. The model does not implement real DHCP exchange, radio behavior, MAC learning, VLAN trunks or a full network stack.

Checks: `node --test test_simulator.mjs`.


## Windows help-desk path

Six new assignments use a personal Windows laptop and this Mac: inventory, connectivity, Mac-to-Windows SSH, disposable standard accounts, common issue triage, and support ticket documentation. Select **Help desk** in the learning path. Existing lessons and browser records remain separate and intact. Overall percentages now include the expanded curriculum, so they can decrease even though no completed work was lost.

Commands are displayed for manual execution only. Each step identifies the host and administrator requirements. Inventory and connectivity come before installation. SSH changes are confined to the Windows device and include rollback; no router forwarding is required. The Mac lab remains loopback-only. The browser does not automatically connect to or configure Windows.

Sources checked for this addition:
- https://learn.microsoft.com/en-us/windows-server/administration/openssh/openssh_install_firstuse
- https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.localaccounts/new-localuser?view=powershell-5.1
- https://learn.microsoft.com/en-us/powershell/module/nettcpip/get-netipconfiguration

Start with Windows PowerShell: hostname, whoami, Get-CimInstance Win32_OperatingSystem, and Get-NetIPConfiguration. Record the Windows version, current network settings and account type before continuing.
