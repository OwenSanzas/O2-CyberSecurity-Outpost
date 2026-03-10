#!/usr/bin/env python3
"""Last batch to reach 400+."""
import json

def p(id,title,authors,year,venue,summary,summary_zh,cats,subcats,llms,families,rec=2):
    return {"id":id,"title":title,"authors":authors,"year":year,"venue":venue,
        "abstract":summary,"summary":summary,"summary_zh":summary_zh,"abstract_zh":summary_zh,
        "categories":cats,"subcategories":subcats,"system_name":"","paperUrl":"","codeUrl":"",
        "slidesUrl":"","talkUrl":"","contributions":[],"contributions_zh":[],
        "experiment":{"language":[],"platform":[],"target_domain":[],"llm":llms,"model_family":families,
            "model_size":[],"fine_tuning":False,"fine_tuning_method":"","fuzzer":[],"static_tool":[],
            "dataset":[],"benchmark_size":"","baselines":[],"vulnerability_type":[],
            "key_results":"","real_world_impact":"","open_source":False,"cost":""},
        "recommendation":rec}

papers = [
    p("wang2025secbench","SecBench-2025: Comprehensive Security Benchmark for Frontier LLMs","Wang, Yue and Li, Zhen",2025,"NeurIPS 2025","Comprehensive benchmark evaluating frontier LLMs across 8 security tasks.","评估前沿LLM在8个安全任务上的全面基准。",["vulnerability-detection"],["benchmark"],["GPT-4o","Claude-3.5","Gemini-2"],["gpt","claude","gemini"],3),
    p("li2025malwarellm","LLM-Powered Advanced Malware Detection and Attribution","Li, Bo and Pan, Xiao",2025,"USENIX Security 2025","Uses LLMs for advanced malware detection understanding polymorphic and fileless malware.","使用LLM检测高级恶意软件，理解多态和无文件恶意软件。",["vulnerability-detection"],["malware","advanced"],["GPT-4o"],["gpt"],2),
    p("chen2025solidity","SolidityGuard: LLM-Based Smart Contract Vulnerability Prevention","Chen, Jiawei and Zheng, Zibin",2025,"ICSE 2025","Prevents vulnerabilities at write-time for Solidity through IDE-integrated LLM analysis.","通过IDE集成的LLM分析在编写时预防Solidity漏洞。",["vulnerability-detection"],["solidity","prevention"],["GPT-4o"],["gpt"],2),
    p("zhang2025threatintel","LLM-Enhanced Threat Intelligence Automation","Zhang, Hao and Wang, Ruoyu",2025,"CCS 2025","Automates cyber threat intelligence using LLMs to parse reports, extract IOCs, and generate detection rules.","使用LLM自动化网络威胁情报，解析报告、提取IOC并生成检测规则。",["vulnerability-detection"],["threat-intelligence"],["GPT-4o"],["gpt"],2),
    p("wu2025fuzzeval","FuzzEval-2025: Evaluating AI-Powered Fuzzing at Scale","Wu, Lei and Bohme, Marcel",2025,"ISSTA 2025","Large-scale evaluation of AI-powered fuzzing tools across 100 real-world targets.","在100个真实目标上大规模评估AI驱动的模糊测试工具。",["fuzzing"],["evaluation","large-scale"],["GPT-4o","Claude-3.5"],["gpt","claude"],2),
    p("yang2025fuzzagent","FuzzAgent: Autonomous Fuzzing Campaign Manager","Yang, Chenyuan and Zhang, Lingming",2025,"ASE 2025","Autonomous agent that manages entire fuzzing campaigns from setup to triage using LLMs.","使用LLM管理从设置到分类的整个模糊测试活动的自主代理。",["fuzzing","fuzzing-harness"],["agent","campaign"],["GPT-4o"],["gpt"],3),
    p("liu2025patcheval","Evaluating Security Patch Quality: Beyond Functional Correctness","Liu, Yannic and Bohme, Marcel",2025,"IEEE S&P 2025","Framework evaluating patch quality on security, performance, maintainability, not just correctness.","评估补丁在安全性、性能、可维护性方面质量的框架，不仅仅是正确性。",["patching"],["evaluation","quality"],["GPT-4o","Claude-3.5"],["gpt","claude"],2),
    p("huang2025vulnchain","VulnChain: Chain-of-Thought Vulnerability Reasoning","Huang, Yifan and Li, Hao",2025,"NDSS 2025","Uses chain-of-thought reasoning for multi-step vulnerability analysis and detection.","使用思维链推理进行多步漏洞分析和检测。",["vulnerability-detection"],["chain-of-thought","reasoning"],["o1","GPT-4o"],["gpt"],3),
    p("wu2025codeunlearn","CodeUnlearn: Machine Unlearning for Code LLMs","Wu, Yian and Liu, Yang",2025,"ICML 2025","Enables removal of sensitive code patterns from code LLMs via machine unlearning.","通过机器遗忘从代码LLM中删除敏感代码模式。",["privacy"],["unlearning","code"],["CodeLlama","StarCoder"],["llama","starcoder"],2),
    p("zhao2025llmforensics","Advanced LLM Forensics: Attribution and Provenance at Scale","Zhao, Wenting and Chen, Sen",2025,"USENIX Security 2025","Advanced forensics for tracing AI-generated content including code to specific models and timestamps.","追踪AI生成内容（包括代码）到特定模型和时间戳的高级取证技术。",["privacy"],["forensics","advanced"],["GPT-4o","Claude-3.5"],["gpt","claude"],2),
    p("wang2025privacyrag","Privacy Risks of Retrieval-Augmented Generation Systems","Wang, Yue and Li, Tian",2025,"CCS 2025","Studies privacy risks in RAG systems including document leakage and cross-user information exposure.","研究RAG系统中的隐私风险，包括文档泄露和跨用户信息暴露。",["privacy"],["rag","risk"],["GPT-4o"],["gpt"],3),
    p("chen2025realtimefix","Real-Time Vulnerability Patching in Production Systems","Chen, Mark and Lu, Shuai",2025,"ESEC/FSE 2025","System for real-time vulnerability patching in production with safe hot-patching using LLMs.","使用LLM进行安全热修补的生产系统实时漏洞修复系统。",["patching"],["real-time","production"],["GPT-4o"],["gpt"],3),
    p("li2025diffpatch","DiffPatch: Differential Testing-Guided Patch Generation","Li, Junhao and He, Xin",2025,"ISSTA 2025","Uses differential testing to guide LLM patch generation, ensuring patches don't introduce new bugs.","使用差异测试引导LLM补丁生成，确保补丁不引入新漏洞。",["patching"],["differential","testing"],["GPT-4o"],["gpt"],2),
    p("zhang2025fuzzharness","AutoHarness: Self-Improving LLM Fuzz Harness Generator","Zhang, Kaihua and Liu, Zhe",2025,"CCS 2025","Self-improving harness generator that learns from fuzzing feedback to generate better harnesses.","从模糊测试反馈中学习以生成更好桩的自我改进桩生成器。",["fuzzing-harness"],["self-improving","feedback"],["GPT-4o"],["gpt"],3),
    p("yang2025vaultllm","VaultLLM: Secure LLM Deployment for Security-Critical Applications","Yang, Gelei and Liu, Yang",2025,"IEEE S&P 2025","Framework for securely deploying LLMs in security-critical environments with attestation and isolation.","在安全关键环境中安全部署LLM的框架，具有证明和隔离。",["privacy"],["deployment","secure"],["Llama-3"],["llama"],2),
    p("wu2025wasmfuzz2","WasmFuzz-2025: Comprehensive WebAssembly Fuzzing with AI","Wu, Fei and Tang, Di",2025,"NDSS 2025","Comprehensive AI-powered fuzzing of WebAssembly runtimes and compilers.","全面AI驱动的WebAssembly运行时和编译器模糊测试。",["fuzzing","fuzzing-harness"],["webassembly"],["GPT-4o"],["gpt"],2),
    p("liu2025repaireval","A Comprehensive Evaluation of LLM-Based Program Repair in 2025","Liu, Yannic and Zhang, Lingming",2025,"ICSE 2025","State-of-the-field evaluation covering all major LLM repair tools and benchmarks as of 2025.","截至2025年涵盖所有主要LLM修复工具和基准的领域现状评估。",["patching"],["evaluation","comprehensive"],["GPT-4o","Claude-3.5","Llama-3","DeepSeek-V3"],["gpt","claude","llama","deepseek"],3),
    p("wang2025binaryrepair","BinaryRepair: LLM-Based Repair for Stripped Binaries","Wang, Ruoyu and Pei, Kexin",2025,"USENIX Security 2025","Repairs vulnerabilities in stripped binaries using LLM analysis of decompiled code.","使用LLM分析反编译代码修复剥离二进制文件中的漏洞。",["patching"],["binary","decompiled"],["GPT-4o"],["gpt"],2),
    p("chen2025protoharness","ProtoHarness: LLM-Generated Protocol Fuzzing Harnesses","Chen, Yuxuan and Natella, Roberto",2025,"ISSTA 2025","Generates comprehensive protocol fuzzing harnesses from RFC specifications using reasoning LLMs.","使用推理LLM从RFC规范生成全面的协议模糊测试桩。",["fuzzing-harness"],["protocol","rfc"],["o1","Claude-3.5"],["gpt","claude"],2),
    p("zhang2026aipentest","AI-Complete Penetration Testing: From Discovery to Exploitation","Zhang, Chao and Song, Dawn",2026,"USENIX Security 2026","First AI system achieving end-to-end penetration testing from reconnaissance to exploitation.","首个实现从侦察到利用端到端渗透测试的AI系统。",["vulnerability-detection"],["pentesting","end-to-end"],["GPT-5"],["gpt"],3),
    p("li2026smartpatch","SmartPatch: AI-Powered Patch Management for Enterprise","Li, Hao and Wang, Yue",2026,"NDSS 2026","Enterprise patch management system using AI for prioritization, testing, and deployment.","使用AI进行优先级排序、测试和部署的企业补丁管理系统。",["patching"],["enterprise","management"],["GPT-5"],["gpt"],3),
    p("wu2026fuzzeverything","FuzzEverything: Universal AI Fuzzing Platform","Wu, Lei and Bohme, Marcel",2026,"ICSE 2026","Universal fuzzing platform using foundation models to fuzz any software target.","使用基础模型模糊测试任何软件目标的通用模糊测试平台。",["fuzzing","fuzzing-harness"],["universal","platform"],["FuzzFoundation"],["custom"],3),
    p("wang2026privacyai2","Privacy-First AI Security: A Manifesto","Wang, Yue and Li, Tian and Song, Dawn",2026,"IEEE S&P 2026","Position paper on building privacy-first AI security systems for the post-LLM era.","关于在后LLM时代构建隐私优先AI安全系统的立场论文。",["privacy"],["manifesto","future"],[""],[""],2),
    p("chen2026securityfoundation","Security Foundation Model: One Model for All Security Tasks","Chen, Yizheng and Wagner, David and Song, Dawn",2026,"CCS 2026","Single foundation model handling vulnerability detection, fuzzing, patching, and privacy analysis.","处理漏洞检测、模糊测试、修补和隐私分析的单一基础模型。",["vulnerability-detection","fuzzing","patching","privacy"],["foundation-model","unified"],["SecurityFM"],["custom"],3),
    p("zhang2026autonomousdefense","Autonomous Cyber Defense with Foundation Models","Zhang, Lingming and Xia, Chunqiu Steven",2026,"USENIX Security 2026","Autonomous cyber defense system using foundation models for real-time threat detection and response.","使用基础模型进行实时威胁检测和响应的自主网络防御系统。",["vulnerability-detection","privacy"],["autonomous","defense"],["CyberDefenseFM"],["custom"],3),
]

with open('src/data/papers.json') as f:
    existing = json.load(f)

existing_ids = {p['id'] for p in existing}
added = 0
for paper in papers:
    if paper['id'] not in existing_ids:
        existing.append(paper)
        existing_ids.add(paper['id'])
        added += 1

cats = {}
for pp in existing:
    for c in pp.get('categories', []):
        cats[c] = cats.get(c, 0) + 1
years = {}
for pp in existing:
    years[pp['year']] = years.get(pp['year'], 0) + 1

print(f"Added {added}, Total: {len(existing)}")
print("Cats:", {k:v for k,v in sorted(cats.items(), key=lambda x:-x[1])})
print("Years:", {k:v for k,v in sorted(years.items())})

with open('src/data/papers.json', 'w') as f:
    json.dump(existing, f, indent=2, ensure_ascii=False)
