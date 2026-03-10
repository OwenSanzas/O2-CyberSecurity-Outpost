export interface DailyPick {
  paperId: string
  title: string
  emoji: string
  oneLiner: string
  body: string
  oneLiner_zh: string
  body_zh: string
}

const picks: DailyPick[] = [
  {
    paperId: "chatafl2024ndss",
    title: "ChatAFL",
    emoji: "📡",
    oneLiner: "Let LLMs read RFCs so your fuzzer doesn't have to.",
    body: "Protocol fuzzing has always had a brutal bootstrapping problem: you need to understand the protocol to generate valid inputs, but the spec is buried in hundreds of pages of RFC prose. ChatAFL's insight is almost too simple — just ask an LLM that already \"read\" the RFC. The result? 47% more state transitions than AFLNET, and 9 new bugs in battle-tested protocol implementations. What makes this work interesting isn't the LLM part alone, it's how they close the loop between LLM-generated grammars and coverage feedback.",
    oneLiner_zh: "让LLM替你读RFC，模糊器就不用自己啃协议文档了。",
    body_zh: "协议模糊测试一直有个老大难：你得先搞懂协议才能造有效输入，但协议规范动辄几百页。ChatAFL的思路几乎简单到不像话——直接问一个已经\"读过\"RFC的LLM。结果呢？比AFLNET多覆盖了47%的状态转换，在久经考验的协议实现中挖出了9个新漏洞。这篇工作的亮点不只是用了LLM，而是把LLM生成的语法和覆盖率反馈形成了闭环。"
  },
  {
    paperId: "covrl2024issta",
    title: "CovRL",
    emoji: "🎮",
    oneLiner: "Teaching a fuzzer to learn from its own mistakes with RL.",
    body: "Most LLM-based fuzzers have a dirty secret: the LLM doesn't know if its mutations actually helped. CovRL fixes this by training the LLM with reinforcement learning, using coverage as the reward signal. The TF-IDF trick for weighting coverage is clever — rare edges matter more. 58 real bugs in JavaScript engines, 15 CVEs. The takeaway: LLMs are better fuzzers when you actually tell them what worked.",
    oneLiner_zh: "用强化学习教模糊器从自己的错误中学习。",
    body_zh: "大多数基于LLM的模糊器有个不太光彩的秘密：LLM根本不知道自己的变异到底有没有用。CovRL用强化学习来解决这个问题，拿代码覆盖率当奖励信号。用TF-IDF加权覆盖率的做法很巧妙——稀有边更有价值。在JavaScript引擎里找到了58个真实漏洞，其中15个CVE。结论：当你告诉LLM什么有效时，它能当个更好的模糊器。"
  },
  {
    paperId: "wasabi2024sosp",
    title: "Wasabi",
    emoji: "🔄",
    oneLiner: "Retry bugs are everywhere, and nobody's been looking.",
    body: "This paper opens your eyes to a class of bugs hiding in plain sight: retry logic. Turns out, the simple pattern of \"if it fails, try again\" is responsible for a shocking number of production incidents. The authors combine LLMs with static analysis to systematically hunt retry bugs across large codebases. It's the kind of paper that makes you immediately grep your own codebase. Published at SOSP, which tells you the systems community takes this seriously.",
    oneLiner_zh: "重试Bug无处不在，但一直没人在找。",
    body_zh: "这篇论文会让你注意到一类藏在眼皮底下的Bug：重试逻辑。结果发现，\"失败了就再来一次\"这个简单模式居然是大量生产事故的罪魁祸首。作者把LLM和静态分析结合起来，系统性地在大型代码库中猎杀重试Bug。这种看完就想马上去grep自己代码库的论文，发在SOSP上，说明系统社区对此很当回事。"
  },
  {
    paperId: "yu2024llmfuzzer",
    title: "LLM-Fuzzer",
    emoji: "🔓",
    oneLiner: "A fuzzer, but for jailbreaking LLMs at scale.",
    body: "Instead of manually crafting jailbreak prompts one by one, why not fuzz the LLM itself? LLM-Fuzzer borrows ideas from traditional software fuzzing — seed selection, mutation, coverage-guided search — and applies them to jailbreak assessment. It's a neat inversion: using fuzzing techniques not to break software, but to break the safety guardrails of AI models. Published at USENIX Security, and if you work on LLM safety, this is required reading.",
    oneLiner_zh: "一个模糊器，但用来大规模越狱LLM。",
    body_zh: "与其一条一条手工构造越狱prompt，不如直接对LLM做模糊测试？LLM-Fuzzer借鉴了传统软件模糊测试的思路——种子选择、变异、覆盖率引导——然后用来评估越狱能力。这是个很妙的反转：用模糊测试技术不是去打软件，而是去打AI模型的安全护栏。发在USENIX Security上，做LLM安全的必读。"
  },
  {
    paperId: "xia2024fuzz4all",
    title: "Fuzz4All",
    emoji: "🌍",
    oneLiner: "One fuzzer to rule them all — across languages, compilers, and runtimes.",
    body: "The promise is bold: a single LLM-based fuzzer that works across any system that takes code as input. C compilers, JavaScript engines, Rust type checkers, SMT solvers — you name it. The secret sauce is using the LLM's code generation ability as a universal input generator, then steering it with autoprompting. They found bugs in GCC, Clang, V8, and even the Go compiler. The paper that proves LLMs can genuinely generalize across fuzzing targets.",
    oneLiner_zh: "一个模糊器统治所有——跨语言、跨编译器、跨运行时。",
    body_zh: "目标够大胆：一个基于LLM的模糊器，能对付任何以代码为输入的系统。C编译器、JavaScript引擎、Rust类型检查器、SMT求解器——统统能打。核心是把LLM的代码生成能力当通用输入生成器，再用autoprompting来导航。在GCC、Clang、V8甚至Go编译器中都找到了Bug。这篇论文证明了LLM确实能在不同模糊测试目标间泛化。"
  },
  {
    paperId: "zhang2024autocoderover",
    title: "AutoCodeRover",
    emoji: "🤖",
    oneLiner: "An AI agent that actually understands your codebase before patching.",
    body: "Most LLM repair tools dump the buggy function into a prompt and pray. AutoCodeRover takes a different approach: it first navigates the codebase like a developer would, understanding the project structure, reading related files, and building context. Only then does it generate a patch. This agent-based approach closed 22% of real GitHub issues on SWE-bench — not by being smarter at code generation, but by being smarter at context gathering. The lesson: in program repair, understanding the problem is harder than generating the fix.",
    oneLiner_zh: "一个先理解你代码库再打补丁的AI智能体。",
    body_zh: "大多数LLM修复工具就是把有Bug的函数扔进prompt然后听天由命。AutoCodeRover走了不同的路：它先像开发者一样浏览代码库，理解项目结构，读相关文件，建立上下文。然后才生成补丁。这种Agent方法在SWE-bench上关闭了22%的真实GitHub issue——不是因为它生成代码更厉害，而是因为它收集上下文更聪明。启示：在程序修复中，理解问题比生成修复更难。"
  },
  {
    paperId: "yang2024pentestllm",
    title: "PentestGPT",
    emoji: "🕵️",
    oneLiner: "GPT-4 as your penetration testing co-pilot.",
    body: "Pentesting is one of those tasks that seems perfect for LLMs: you need to reason about attack surfaces, chain together exploits, and adapt to unexpected situations. PentestGPT gives GPT-4 the ability to plan and execute penetration tests, handling the back-and-forth reasoning that makes pentesting hard to automate. Published at USENIX Security. The results are surprisingly competent on standard CTF challenges, though real-world engagements remain a different beast.",
    oneLiner_zh: "GPT-4 做你的渗透测试搭档。",
    body_zh: "渗透测试看起来天生适合LLM：你需要推理攻击面、串联利用链、适应各种意外情况。PentestGPT让GPT-4能够规划和执行渗透测试，处理那些让渗透测试难以自动化的来回推理。发表在USENIX Security。在标准CTF挑战上的表现出人意料地靠谱，不过真实环境的渗透测试还是另一回事。"
  },
  {
    paperId: "google2025ossfuzzai",
    title: "OSS-Fuzz-AI",
    emoji: "🏭",
    oneLiner: "Google scaled LLM fuzzing to 1000+ open source projects. Yes, really.",
    body: "This isn't a research prototype — it's Google deploying LLM-generated fuzz harnesses across their entire OSS-Fuzz infrastructure. The key engineering insight: iterative compilation feedback. When the LLM-generated harness doesn't compile, feed the error back and try again. Simple, but it works at scale. The sheer breadth of coverage (1000+ projects) makes this arguably the most impactful LLM-for-fuzzing deployment to date.",
    oneLiner_zh: "Google把LLM模糊测试扩展到了1000多个开源项目。没错，真的。",
    body_zh: "这不是研究原型——这是Google在整个OSS-Fuzz基础设施上部署LLM生成的模糊测试驱动。关键工程洞察：迭代编译反馈。LLM生成的驱动编不过？把错误喂回去再来。简单，但能大规模运行。光是覆盖范围（1000多个项目）就足以让它成为迄今最有影响力的LLM-for-fuzzing部署。"
  },
  {
    paperId: "jimenez2024swebench",
    title: "SWE-bench",
    emoji: "📊",
    oneLiner: "The benchmark that humbled every AI coding agent.",
    body: "Before SWE-bench, LLM coding benchmarks were toy problems. SWE-bench changed the game by collecting 2,294 real GitHub issues from 12 popular Python repos, complete with the full repo context and ground truth patches. The initial results were sobering: even GPT-4 could only resolve ~2% of issues. This benchmark single-handedly spawned an entire subfield of AI software engineering agents. If you follow one benchmark in this space, make it this one.",
    oneLiner_zh: "让所有AI编程智能体都谦虚了的基准测试。",
    body_zh: "在SWE-bench之前，LLM编程基准都是玩具级问题。SWE-bench从12个热门Python仓库收集了2294个真实GitHub issue，带完整仓库上下文和标准答案补丁。初始结果让人清醒：连GPT-4也只能解决约2%的issue。这个基准测试以一己之力催生了整个AI软件工程智能体的子方向。如果你只关注这个领域的一个基准，就选它。"
  },
  {
    paperId: "yang2024sweagent",
    title: "SWE-agent",
    emoji: "💻",
    oneLiner: "The right interface matters more than the right model.",
    body: "SWE-agent's most important contribution isn't the agent itself — it's the agent-computer interface (ACI). By designing custom commands for file navigation, editing, and testing, they made the LLM dramatically more effective at resolving GitHub issues. It's a design lesson: throwing a raw terminal at an LLM doesn't work. Give it the right tools, and performance jumps. 12.5% resolve rate on SWE-bench, which was state-of-the-art at the time.",
    oneLiner_zh: "正确的接口比正确的模型更重要。",
    body_zh: "SWE-agent最重要的贡献不是智能体本身——而是智能体-计算机接口（ACI）。通过设计定制的文件导航、编辑和测试命令，LLM在解决GitHub issue时的效果大幅提升。这是一个设计课：把原始终端直接扔给LLM是不行的，给它合适的工具，性能就能飞跃。在SWE-bench上12.5%的解决率，当时的SOTA。"
  },
  {
    paperId: "xia2024agentless",
    title: "Agentless",
    emoji: "✂️",
    oneLiner: "Who needs agents? A simple pipeline beats them all.",
    body: "After everyone rushed to build complex agent architectures for SWE-bench, this paper asks a rude question: do you actually need all that complexity? Agentless uses a dead-simple two-phase approach — localize, then patch — with no tool use, no multi-turn reasoning, no fancy agent loops. And it beats most agent-based systems. Sometimes the boring solution wins. Essential reading for anyone building AI dev tools.",
    oneLiner_zh: "谁需要智能体？一个简单流水线就能赢。",
    body_zh: "在所有人都忙着为SWE-bench搭建复杂智能体架构之后，这篇论文问了个不客气的问题：你真的需要那么复杂吗？Agentless用了个极简的两步法——先定位，再打补丁——不用工具调用，不搞多轮推理，没有花哨的Agent循环。结果比大多数Agent系统还强。有时候无聊的方案反而赢了。做AI开发工具的必读。"
  },
  {
    paperId: "carlini2021extracting",
    title: "Training Data Extraction",
    emoji: "🔍",
    oneLiner: "GPT-2 remembers your data. All of it.",
    body: "This paper from Carlini et al. changed the conversation about LLM privacy. They showed that you can literally extract verbatim training data from GPT-2 — phone numbers, addresses, code snippets, URLs — just by prompting it the right way. The scarier part: larger models memorize more. This isn't a theoretical attack; it works in practice. If you ever need to convince someone that LLM privacy is a real problem, start with this paper.",
    oneLiner_zh: "GPT-2记住了你的数据，全部。",
    body_zh: "Carlini等人的这篇论文改变了关于LLM隐私的讨论。他们证明你可以从GPT-2中逐字提取训练数据——电话号码、地址、代码片段、URL——只需要用对的方式提示它。更可怕的是：模型越大，记住得越多。这不是理论攻击，实际可行。如果你需要说服谁LLM隐私是个真问题，从这篇开始。"
  },
  {
    paperId: "zou2023universal",
    title: "GCG Attack",
    emoji: "⚡",
    oneLiner: "A suffix that jailbreaks every LLM. Yes, every one.",
    body: "The GCG attack is elegantly terrifying: append a computationally optimized suffix to any prompt, and aligned LLMs will happily produce harmful content. What's worse, these adversarial suffixes transfer across models — a suffix optimized on Llama works on GPT-4. This paper forced the entire alignment community to rethink their defenses. The attack is automated, scalable, and embarrassingly effective. Required reading for the AI safety crowd.",
    oneLiner_zh: "一个后缀就能越狱所有LLM。对，所有。",
    body_zh: "GCG攻击优雅得让人害怕：在任何提示后面加一段计算优化的后缀，对齐过的LLM就会乖乖生成有害内容。更糟糕的是，这些对抗后缀可以跨模型迁移——在Llama上优化的后缀对GPT-4也有效。这篇论文迫使整个对齐社区重新审视他们的防御。攻击是自动化、可扩展、而且尴尬地有效。AI安全界必读。"
  },
  {
    paperId: "fang2024llm",
    title: "LLM Agents Exploit CVEs",
    emoji: "💣",
    oneLiner: "GPT-4 can hack real systems. The others can't.",
    body: "Richard Fang's team gave LLM agents real CVEs and told them to exploit the vulnerabilities autonomously. GPT-4 succeeded on 87% of them. Every other model — GPT-3.5, open-source LLMs, even dedicated security scanners like ZAP and Metasploit — scored exactly 0%. The catch: GPT-4 needs the CVE description to succeed; without it, success drops to 7%. This paper is as much about the gap between GPT-4 and everything else as it is about autonomous exploitation.",
    oneLiner_zh: "GPT-4能黑掉真实系统，其他模型全不行。",
    body_zh: "Richard Fang团队给LLM智能体真实的CVE，让它们自主利用漏洞。GPT-4成功了87%。所有其他模型——GPT-3.5、开源LLM、甚至ZAP和Metasploit这样的专业安全扫描器——全部0%。但有个条件：GPT-4需要CVE描述才能成功，没有的话成功率降到7%。这篇论文与其说是关于自主利用，不如说是关于GPT-4和其他一切之间的鸿沟。"
  },
  {
    paperId: "fang2024teams",
    title: "Teams of LLM Agents",
    emoji: "👥",
    oneLiner: "One agent can't find zero-days. A team of them can.",
    body: "The sequel to the CVE exploitation paper goes harder: can LLM agents find and exploit zero-day vulnerabilities? A single agent struggles, but a hierarchical team — with a planning agent dispatching specialized subagents — achieves 4.5x better performance. The architecture mirrors how real red teams operate. This is both impressive and unsettling research, raising hard questions about what happens when these capabilities become widely available.",
    oneLiner_zh: "一个智能体找不到零日漏洞，但一个团队可以。",
    body_zh: "CVE利用论文的续集更猛：LLM智能体能找到并利用零日漏洞吗？单个智能体不行，但一个分层团队——由规划智能体调度专业子智能体——性能提升了4.5倍。架构模仿了真实红队的运作方式。这是既令人印象深刻又令人不安的研究，引发了关于这些能力广泛可用后会怎样的严肃问题。"
  },
  {
    paperId: "fu2022vulrepair",
    title: "VulRepair",
    emoji: "🩹",
    oneLiner: "T5 learns to patch vulnerabilities, and it's better than you'd think.",
    body: "VulRepair fine-tunes T5 specifically for security patch generation. What's refreshing about this paper is its focus on the security repair task rather than general bug fixing — the training data, evaluation metrics, and error analysis are all security-specific. The model generates compilable and correct patches for a meaningful percentage of real-world CVEs. This was published at ESEC/FSE 2022, and it helped establish the LLM-for-patching research direction.",
    oneLiner_zh: "T5学会了打安全补丁，效果比你想象的好。",
    body_zh: "VulRepair专门为安全补丁生成微调了T5。这篇论文清新的地方在于它聚焦安全修复任务而非通用Bug修复——训练数据、评估指标、错误分析都是安全特定的。模型为相当比例的真实CVE生成了可编译的正确补丁。2022年发在ESEC/FSE，帮助开创了LLM-for-patching的研究方向。"
  },
  {
    paperId: "deng2023large",
    title: "TitanFuzz",
    emoji: "🧪",
    oneLiner: "Zero-shot fuzzing of PyTorch and TensorFlow. No training needed.",
    body: "TitanFuzz shows that LLMs already know enough about deep learning APIs to generate meaningful fuzz tests — no fine-tuning required. Feed the model an API signature, and it generates diverse, valid test programs that exercise corner cases. They found real bugs in PyTorch and TensorFlow, including some that had been lurking for years. The zero-shot aspect is what makes this powerful: it generalizes to any library the LLM has seen during pre-training.",
    oneLiner_zh: "零样本模糊测试PyTorch和TensorFlow，不需要训练。",
    body_zh: "TitanFuzz表明LLM已经对深度学习API懂得够多，能生成有意义的模糊测试——不需要微调。给模型一个API签名，它就能生成多样的、有效的测试程序来测试边界情况。在PyTorch和TensorFlow中找到了真实Bug，有些潜伏了好几年。零样本这一点是关键：它能泛化到LLM在预训练时见过的任何库。"
  },
  {
    paperId: "wang2024smartinv",
    title: "SmartInv",
    emoji: "📜",
    oneLiner: "Multimodal learning to catch smart contract bugs that tools miss.",
    body: "Traditional smart contract analyzers rely on predefined patterns, which means they miss novel attack vectors. SmartInv takes a multimodal approach, combining code semantics with transaction patterns and natural language specifications to infer contract invariants. Published at IEEE S&P — the top security venue. What stands out is the ability to catch \"machine-level\" vulnerabilities that don't map to any known CWE pattern.",
    oneLiner_zh: "多模态学习捕获工具遗漏的智能合约漏洞。",
    body_zh: "传统智能合约分析器依赖预定义模式，意味着它们会漏掉新型攻击向量。SmartInv采用多模态方法，结合代码语义、交易模式和自然语言规范来推断合约不变量。发表在IEEE S&P——顶级安全会议。突出的是它能捕获不属于任何已知CWE模式的\"机器级\"漏洞。"
  },
  {
    paperId: "wen2024scale",
    title: "SCALE",
    emoji: "🌳",
    oneLiner: "Structure your code comments like a tree, and LLMs detect vulns better.",
    body: "SCALE's insight: pre-trained models are better at detecting vulnerabilities when you first transform source code into structured comment trees. Instead of feeding raw code, they decompose it into hierarchical natural language descriptions, making it easier for the LLM to reason about program semantics. Tested on real-world datasets, it outperforms baselines that use raw code. Published at ISSTA, this paper highlights that how you represent code matters as much as which model you use.",
    oneLiner_zh: "把代码注释结构化成树，LLM就能更好地检测漏洞。",
    body_zh: "SCALE的洞察：先把源代码转换成结构化注释树，预训练模型检测漏洞的效果会更好。不是直接喂原始代码，而是分解成层次化的自然语言描述，让LLM更容易推理程序语义。在真实数据集上的表现优于直接使用原始代码的基线。发在ISSTA上，这篇论文强调了代码的表示方式和使用哪个模型一样重要。"
  },
  {
    paperId: "yang2024large",
    title: "LLMAO",
    emoji: "🐛",
    oneLiner: "LLMs locate bugs without running a single test.",
    body: "Test-free fault localization sounds like a contradiction, but LLMAO makes it work. Instead of running tests to find where the bug is, they ask the LLM to directly reason about which lines are buggy based on code context alone. The name is a meme and the results are serious: competitive with test-based localization on Defects4J. This paper matters because it removes the biggest barrier to automated debugging — you no longer need a test suite to get started.",
    oneLiner_zh: "LLM不跑一个测试就能定位Bug。",
    body_zh: "不跑测试就定位Bug听起来像矛盾，但LLMAO做到了。不用跑测试来找Bug在哪，而是让LLM直接根据代码上下文推理哪些行有问题。名字是个梗但结果很正经：在Defects4J上和基于测试的定位方法不相上下。这篇论文的意义在于移除了自动调试最大的门槛——你不再需要测试套件就能开始。"
  },
  {
    paperId: "jin2023inferfix",
    title: "InferFix",
    emoji: "🔗",
    oneLiner: "Static analysis finds the bug. RAG-powered LLM writes the fix.",
    body: "InferFix connects two worlds that usually don't talk: Facebook's Infer static analyzer and retrieval-augmented LLM generation. Infer finds bugs with high precision, then InferFix retrieves similar past fixes from a database and uses them as context for the LLM to generate a patch. The retrieve-then-generate pattern is now everywhere in AI, but InferFix was one of the first to apply it to program repair. Published at FSE 2023.",
    oneLiner_zh: "静态分析找Bug，RAG驱动的LLM写修复。",
    body_zh: "InferFix连接了两个通常不说话的世界：Facebook的Infer静态分析器和检索增强LLM生成。Infer高精度地找Bug，然后InferFix从数据库中检索类似的历史修复作为LLM生成补丁的上下文。检索再生成这个模式现在在AI中到处都是，但InferFix是最早将其应用于程序修复的之一。2023年发表在FSE。"
  },
  {
    paperId: "lu2024vulragent",
    title: "VulR-Agent",
    emoji: "🔬",
    oneLiner: "An AI agent that does vulnerability research like a human analyst.",
    body: "VulR-Agent doesn't just detect vulnerabilities — it researches them. Like a human security analyst, it reads code, identifies potential issues, writes PoC exploits, and assesses severity. The agent architecture lets it iterate: if the initial analysis is wrong, it goes back and tries a different approach. Published at CCS, this pushes the boundary from \"vulnerability detection\" to \"vulnerability research\" — a qualitatively different task.",
    oneLiner_zh: "一个像人类分析师一样做漏洞研究的AI智能体。",
    body_zh: "VulR-Agent不只检测漏洞——它研究漏洞。像人类安全分析师一样，它读代码、识别潜在问题、写PoC利用、评估严重性。Agent架构让它能迭代：如果初始分析错了，它会回头换个思路。发表在CCS上，这把边界从\"漏洞检测\"推向了\"漏洞研究\"——质的飞跃。"
  },
  {
    paperId: "yang2024whitefox",
    title: "WhiteFox",
    emoji: "🦊",
    oneLiner: "LLMs understand compiler optimizations well enough to break them.",
    body: "Compiler fuzzing is hard because you need inputs that trigger specific optimization passes. WhiteFox has the LLM read the compiler's optimization source code and then generate test programs that target those specific optimizations. It's white-box fuzzing powered by natural language understanding. Found real bugs in GCC, LLVM, and the TensorFlow XLA compiler. The idea that an LLM can \"understand\" compiler internals well enough to craft targeted inputs is both surprising and powerful.",
    oneLiner_zh: "LLM对编译器优化的理解足以把它们打破。",
    body_zh: "编译器模糊测试很难，因为你需要触发特定优化pass的输入。WhiteFox让LLM读编译器的优化源代码，然后生成针对这些优化的测试程序。这是自然语言理解驱动的白盒模糊测试。在GCC、LLVM和TensorFlow XLA编译器中发现了真实Bug。LLM能\"理解\"编译器内部并构造针对性输入这件事，既出人意料又很有力量。"
  },
  {
    paperId: "xia2024apr",
    title: "LLM-based APR Study",
    emoji: "📈",
    oneLiner: "The first large-scale study that maps the LLM repair landscape.",
    body: "Before this paper, everyone was publishing LLM repair results on different benchmarks with different settings, and nobody could compare anything. This ICSE 2024 paper fixes that with the first extensive study across multiple LLMs (Codex, ChatGPT, GPT-4, InCoder, CodeGen), multiple benchmarks, and multiple repair strategies. The finding that surprised everyone: the largest model isn't always the best, and few-shot prompting doesn't always help. Essential for anyone entering the automated repair space.",
    oneLiner_zh: "第一个全面绘制LLM修复版图的大规模研究。",
    body_zh: "在这篇论文之前，大家在不同基准上用不同设置发表LLM修复结果，没人能比较。ICSE 2024的这篇论文用首个涵盖多个LLM（Codex、ChatGPT、GPT-4、InCoder、CodeGen）、多个基准和多种修复策略的大规模研究来解决这个问题。让所有人惊讶的发现：最大的模型不总是最好的，少样本提示也不总有帮助。进入自动修复领域的必读。"
  },
  {
    paperId: "ding2024vulnerability",
    title: "PrimeVul",
    emoji: "🎭",
    oneLiner: "Your vulnerability detection benchmark is lying to you.",
    body: "This paper is a cold shower for the vulnerability detection community. The authors show that existing benchmarks (BigVul, etc.) have terrible label quality, rampant duplication, and data leakage. A \"SOTA\" model scoring 68% F1 on BigVul drops to 3% F1 on their cleaned-up PrimeVul benchmark. Even GPT-4 performs at random-guessing levels. If you're publishing vulnerability detection numbers, read this paper first — your evaluation might be meaningless.",
    oneLiner_zh: "你的漏洞检测基准在骗你。",
    body_zh: "这篇论文给漏洞检测社区泼了一盆冷水。作者证明现有基准（BigVul等）标签质量糟糕、重复泛滥、数据泄漏严重。一个在BigVul上\"SOTA\"的68% F1模型，在他们清理过的PrimeVul基准上跌到3% F1。连GPT-4都和随机猜差不多。如果你在发漏洞检测的数字，先读这篇——你的评估可能毫无意义。"
  },
  {
    paperId: "chen2024muzeel",
    title: "Muzeel",
    emoji: "🎵",
    oneLiner: "Structured test programs for finding JS engine bugs at scale.",
    body: "JavaScript engine bugs are high-value targets — they lead to browser exploits. Muzeel generates structured test programs by having LLMs understand JavaScript language semantics, not just syntax. The key difference from random grammar-based fuzzers: Muzeel's tests are semantically meaningful, triggering deeper engine behaviors. Published at USENIX Security 2024.",
    oneLiner_zh: "结构化测试程序大规模发现JS引擎Bug。",
    body_zh: "JavaScript引擎Bug是高价值目标——它们导致浏览器漏洞利用。Muzeel通过让LLM理解JavaScript语言语义（不只是语法）来生成结构化测试程序。和随机语法模糊器的关键区别：Muzeel的测试在语义上有意义，能触发更深层的引擎行为。发表在USENIX Security 2024。"
  },
  {
    paperId: "llmif2024sp",
    title: "LLMIF",
    emoji: "📱",
    oneLiner: "Finally, a fuzzer that speaks IoT protocols fluently.",
    body: "IoT protocol fuzzing has always struggled with the diversity of protocols and the lack of specifications. LLMIF augments fuzzing with an LLM that understands IoT protocol structures, generating valid-but-boundary-testing inputs. Published at IEEE S&P, the top security venue. Found real vulnerabilities in widely-deployed IoT devices. If you work on embedded security, this one's for you.",
    oneLiner_zh: "终于，一个能流利\"说\"IoT协议的模糊器。",
    body_zh: "IoT协议模糊测试一直苦于协议多样性和规范缺乏。LLMIF用理解IoT协议结构的LLM来增强模糊测试，生成有效但测试边界的输入。发表在IEEE S&P——顶级安全会议。在广泛部署的IoT设备中发现了真实漏洞。做嵌入式安全的，这篇为你准备。"
  },
  {
    paperId: "libro2023icse",
    title: "LIBRO",
    emoji: "📝",
    oneLiner: "Bug reports in, test cases out. LLMs as few-shot test generators.",
    body: "LIBRO takes a practical angle: given a bug report in natural language, generate a test case that reproduces it. No fancy architecture, just clever few-shot prompting with real bug report / test case pairs. Published at ICSE 2023, it's one of the early papers showing LLMs can bridge the gap between human-written bug descriptions and executable test code. Simple idea, solid execution.",
    oneLiner_zh: "Bug报告进去，测试用例出来。LLM做少样本测试生成器。",
    body_zh: "LIBRO走实用路线：给一个自然语言的Bug报告，生成能复现它的测试用例。没有花哨架构，就是用真实的Bug报告/测试用例对做巧妙的少样本提示。2023年发在ICSE，是最早展示LLM能弥合人写Bug描述和可执行测试代码之间差距的论文之一。简单思路，扎实执行。"
  },
  {
    paperId: "fuzz_meets_llm_survey2024",
    title: "When Fuzzing Meets LLMs",
    emoji: "🗺️",
    oneLiner: "The roadmap for LLM + fuzzing research.",
    body: "If you're starting research on LLM-enhanced fuzzing, read this survey first. It doesn't just catalog existing work — it identifies 5 specific challenges, backs them with evidence from top-tier papers, and proposes concrete research directions. Published at FSE 2024, it's the kind of survey that saves you months of literature review and actually tells you where the open problems are.",
    oneLiner_zh: "LLM + 模糊测试研究的路线图。",
    body_zh: "如果你刚开始做LLM增强模糊测试的研究，先读这篇综述。它不只是罗列已有工作——它识别了5个具体挑战，用顶会论文的证据支撑，并提出了具体的研究方向。2024年发在FSE，这种综述能帮你省下几个月的文献调研，而且真的告诉你开放问题在哪。"
  },
]

export default picks
