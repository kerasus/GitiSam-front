import { useRoute, useRouter } from 'vue-router';
import { ref, watch, type Ref, onMounted, onUnmounted } from 'vue';

const reactiveRouteHash = ref('');

export interface ParsedHash {
  formTableName: string;
  state: string;
  entityId?: string;
  extra?: string;
}

export function useFormTableBackBtn(
  formTableName: string,
  tab: Ref<'form' | 'table' | undefined>,
  formType: Ref<'update' | 'create'>,
  entityId: Ref<number | null | undefined>,
  onClickCreateBtn: () => void,
  onClickEditRowBtn: (id: number) => void,
  getExtraData?: () => string,
  onChangeRouteHash?: (parsedHashs: ParsedHash[]) => void,
) {
  // example of hash: #section3:create|section4:list|section1:update:12|section2:update:5

  const route = useRoute();
  const router = useRouter();

  function getAllOfRouteHash(): string {
    return reactiveRouteHash.value || route.hash.replace('#', '');
  }

  function getFormTableHashs(hashs?: string): string {
    const routeHash = hashs || getAllOfRouteHash();

    // Extract and return only the hash wrapped with <ft_ ... _ft>
    const match = routeHash.match(/<ft_(.*?)_ft>/);
    return match && match[1] ? match[1] : '';
  }

  function hashsHasFormTableHas(hashs: string): boolean {
    return /<ft_(.*?)_ft>/.test(hashs);
  }

  function getUpdatedHasheByNewFormTableHash(formTableHash: string): string {
    const routeHash = getAllOfRouteHash();

    // Remove any existing form table hash wrapped with <ft_ ... _ft>
    const cleanedHash = routeHash.replace(/<ft_.*?_ft>/, '').trim();

    // Wrap the new form table hash
    const wrappedFormTableHash = formTableHash ? `<ft_${formTableHash}_ft>` : '';

    // Return the updated hash
    return `${wrappedFormTableHash}${cleanedHash ? `|${cleanedHash}` : ''}`;
  }

  function getStringHashs(hashs: ParsedHash[]): string {
    function getEntityId(hash: ParsedHash) {
      if (hash.extra && hash.state === 'create') {
        return '-';
      }
      if (!hash.extra && hash.state === 'create') {
        return undefined;
      }

      return hash.entityId;
    }

    return hashs
      .filter((parsedHash) => parsedHash.state !== 'list')
      .map((hash) =>
        [hash.formTableName, hash.state, getEntityId(hash), hash.extra]
          .filter((item) => item)
          .join(':'),
      )
      .join('|');
  }

  function getHashs(hashs: string): ParsedHash[] {
    return hashs
      .split('|')
      .map((hash) => getParsedHash(hash))
      .filter((hash) => hash.formTableName);
  }

  function getParsedHash(hash: string): ParsedHash {
    const arrHash = hash.split(':');

    return {
      formTableName: arrHash[0] ? arrHash[0] : 'tableName',
      state: arrHash[1] ? arrHash[1] : '',
      entityId: arrHash[2],
      extra: arrHash.slice(3).join(':'),
    };
  }

  async function setRouteHash(
    tab: 'form' | 'table' | undefined,
    formType: 'update' | 'create',
    entityId: number | null | undefined,
  ) {
    function getHash(): ParsedHash {
      const oldHashs = getHashs(getFormTableHashs());
      const hash = oldHashs.find((hash) => hash.formTableName === formTableName);

      const newHash: ParsedHash = hash || {
        formTableName,
        state: 'list',
        extra: getExtraData ? getExtraData() : undefined,
      };
      if (tab === undefined) {
        return newHash;
      }
      if (tab === 'table') {
        newHash.state = 'list';
        newHash.entityId = undefined;
        return newHash;
      }
      if (tab === 'form') {
        if (formType === 'create') {
          newHash.state = 'create';
          newHash.entityId = undefined;
          return newHash;
        }
        if (formType === 'update') {
          newHash.state = 'update';
          newHash.entityId = entityId?.toString();
        }
      }
      return newHash;
    }

    const newHash = getHash();
    const updatedOldHashs = getUpdatedOldHashs(newHash);
    const newHashString = getStringHashs(updatedOldHashs);

    await updateRouteWithHash(newHashString);
  }

  function getUpdatedOldHashs(newHash: ParsedHash): ParsedHash[] {
    const oldHashs = getHashs(getFormTableHashs());
    const oldHash = oldHashs.find((hash) => hash.formTableName === formTableName);
    if (!oldHash) {
      oldHashs.push(newHash);
    } else {
      oldHashs.forEach((hash) => {
        if (hash.formTableName === newHash.formTableName) {
          hash.state = newHash.state;
          hash.entityId = newHash.entityId;
          hash.extra = newHash.extra;
        }
      });
    }

    return oldHashs;
  }

  async function updateRouteWithHash(newHash: string) {
    reactiveRouteHash.value = getUpdatedHasheByNewFormTableHash(newHash);
    await router.push({
      name: route.name,
      params: route.params,
      query: route.query,
      hash: reactiveRouteHash.value ? `#${reactiveRouteHash.value}` : '',
    });
  }

  function setTabFromRouteHash(
    tab: Ref<'form' | 'table' | undefined>,
    formType: Ref<'update' | 'create'>,
    onClickCreateBtn: () => void,
    onClickEditRowBtn: (id: number) => void,
  ) {
    const oldHashs = getHashs(getFormTableHashs());
    const hash = oldHashs.find((hash) => hash.formTableName === formTableName);
    if (!hash) {
      tab.value = 'table';
      return;
    }

    if (hash.state === 'list') {
      tab.value = 'table';
      return;
    }
    if (hash.state === 'create') {
      tab.value = 'form';
      formType.value = 'create';
      onClickCreateBtn();
      return;
    }
    if (hash.state === 'update') {
      tab.value = 'form';
      formType.value = 'update';
      onClickEditRowBtn(Number(hash.entityId));
    }
  }

  function loadOnReady() {
    setTabFromRouteHash(tab, formType, onClickCreateBtn, onClickEditRowBtn);
  }

  watch(
    () => route.hash,
    (newHash, oldHash) => {
      if (typeof onChangeRouteHash === 'function') {
        onChangeRouteHash(getHashs(getFormTableHashs()));
      }
      if (oldHash || !hashsHasFormTableHas(reactiveRouteHash.value)) {
        reactiveRouteHash.value = route.hash.replace('#', '');
      }
      setTabFromRouteHash(tab, formType, onClickCreateBtn, onClickEditRowBtn);
    },
    {
      immediate: true,
    },
  );

  watch(
    tab,
    () => {
      setRouteHash(tab.value, formType.value, entityId.value);
    },
    {
      immediate: true,
    },
  );

  onMounted(() => {
    loadOnReady();
  });

  onUnmounted(async () => {
    const oldHashs = getHashs(getFormTableHashs());
    const hashsWithoutFormTable = getStringHashs(
      oldHashs.filter((hash) => hash.formTableName !== formTableName),
    );

    await updateRouteWithHash(hashsWithoutFormTable);
  });

  return {
    // variable
    reactiveRouteHash,

    // method
    getHashs,
    loadOnReady,
    setRouteHash,
    getStringHashs,
    getFormTableHashs,
    getUpdatedOldHashs,
    updateRouteWithHash,
  };
}
