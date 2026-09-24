/** 항목별 실제 기술 스택 (저장소 requirements·import와 논문 본문 기준). [이름, 로고 파일] — 로고가 없으면 글자만 */
export type Stack = [string, string?][]

const HF = 'huggingface.svg'
export const STACK: Record<string, Stack> = {
  'pub-thesis': [['Llama 3.1-8B-Instruct', 'meta.svg'], ['PyTorch', 'pytorch.svg'], ['Transformers · PEFT (QLoRA)', HF], ['Unsloth', 'unsloth.png'], ['bitsandbytes'], ['Weights & Biases', 'weightsandbiases.svg'], ['scikit-learn', 'scikitlearn.svg']],
  'pub-tkips': [['Llama 3.1-8B', 'meta.svg'], ['PyTorch', 'pytorch.svg'], ['Transformers · PEFT (LoRA)', HF], ['bitsandbytes'], ['Weights & Biases', 'weightsandbiases.svg'], ['scikit-learn', 'scikitlearn.svg']],
  'pub-kaes': [['KoBERT · KoELECTRA · mBART-50', HF], ['PyTorch', 'pytorch.svg'], ['PyTorch Lightning', 'lightning.svg'], ['scikit-learn', 'scikitlearn.svg'], ['Weights & Biases', 'weightsandbiases.svg']],
  'pub-feak': [['KoBERT · BiGRU', HF], ['PyTorch', 'pytorch.svg'], ['GPT-4o-mini (OpenAI API)', 'openai.svg'], ['scikit-learn', 'scikitlearn.svg']],
  'pub-ukta': [['KoBERT · BiGRU', HF], ['PyTorch', 'pytorch.svg'], ['Bareun 형태소 분석기'], ['Optuna', 'optuna.svg'], ['Dask', 'dask.svg'], ['scikit-learn', 'scikitlearn.svg']],
  'pub-hclt': [['KoBERT · KcELECTRA · KoT5', HF], ['PyTorch', 'pytorch.svg'], ['PyTorch Lightning', 'lightning.svg'], ['scikit-learn', 'scikitlearn.svg']],
  'pub-kcc': [['KoBERT', HF], ['TensorFlow', 'tensorflow.svg'], ['Keras', 'keras.svg'], ['Word2Vec · LSTM'], ['scikit-learn', 'scikitlearn.svg']],
  'proj-geulgyeol': [
    ['Kanana-1.5-8B-Instruct', 'kakao.svg'],
    ['PyTorch · Transformers · PEFT (LoRA)', 'pytorch.svg'],
    ['vLLM AsyncLLMEngine', 'vllm.png'],
    ['FastAPI · Pydantic · SSE', 'fastapi.svg'],
    ['HTML · CSS · Vanilla JavaScript'],
    ['Bareun · Kiwi · ETRI WiseNLU'],
    ['국립국어원 사전·전문용어 API · 어문규범 데이터'],
  ],
  'proj-lh': [['EEVE-Korean-10.8B · LoRA', HF], ['bge-m3 · FAISS · BM25'], ['LangChain', 'langchain.svg'], ['FastAPI', 'fastapi.svg'], ['vLLM', 'vllm.png'], ['Triton Inference Server', 'nvidia.svg'], ['Next.js · React', 'nextdotjs.svg'], ['Locust', 'locust.svg'], ['Rebellions ATOM NPU']],
  'proj-ukta-proj': [['KoBERT · GRU · Attention', HF], ['PyTorch', 'pytorch.svg'], ['scikit-learn', 'scikitlearn.svg'], ['Optuna', 'optuna.svg'], ['Dask', 'dask.svg']],
  'proj-oem': [['FastAPI', 'fastapi.svg'], ['LangChain', 'langchain.svg'], ['OpenAI API', 'openai.svg'], ['Next.js · React', 'nextdotjs.svg'], ['PostgreSQL', 'postgresql.svg'], ['Docker', 'docker.svg'], ['Pydantic', 'pydantic.svg'], ['SQLAlchemy', 'sqlalchemy.svg'], ['Claude API', 'claude.svg'], ['FAISS'], ['AWS', 'amazonwebservices.svg']],
  'proj-aihub': [['KoT5 · klue/bert-base · KoELECTRA', HF], ['KR-SBERT (Sentence-Transformers)', HF], ['PyTorch', 'pytorch.svg'], ['PyTorch Lightning', 'lightning.svg'], ['Selenium', 'selenium.svg'], ['py-hanspell']],
  'proj-hscode': [['Sentence-Transformers all-MiniLM-L6-v2', HF], ['PyTorch', 'pytorch.svg'], ['Selenium', 'selenium.svg'], ['DeepL API', 'deepl.svg'], ['Django REST Framework', 'django.svg'], ['pandas', 'pandas.svg']],
}
export const stackOf = (kind: string, id: string): Stack | undefined => STACK[`${kind}-${id}`]
