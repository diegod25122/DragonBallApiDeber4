import { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import { AppButton } from '@/components/AppButton';
import { Panel } from '@/components/manga/Panel';
import { SphereRating } from '@/components/SphereRating';
import { Colors, Fonts, Ink, Radius, Spacing } from '@/constants/theme';
import { NOTE_MAX, validateMemberForm, type MemberForm as FormValue, type MemberFormErrors } from '@/domain/team';

interface Props {
  initial: FormValue;
  submitLabel: string;
  onSubmit: (value: FormValue) => void;
}

export function MemberForm({ initial, submitLabel, onSubmit }: Props) {
  const [note, setNote] = useState(initial.note);
  const [rating, setRating] = useState(initial.rating);
  const [errors, setErrors] = useState<MemberFormErrors>({});

  const handleSubmit = () => {
    const result = validateMemberForm({ note, rating });
    if (!result.ok) {
      setErrors(result.errors);
      return;
    }
    setErrors({});
    onSubmit(result.value);
  };

  return (
    <Panel shadowColor={Colors.gold} innerStyle={styles.form}>
      <View style={styles.field}>
        <Text style={styles.label}>Nota *</Text>
        <TextInput
          value={note}
          onChangeText={(text) => {
            setNote(text);
            if (errors.note) setErrors((prev) => ({ ...prev, note: undefined }));
          }}
          placeholder="¿Por qué lo quieres en tu equipo?"
          placeholderTextColor={Colors.inkSoft}
          multiline
          maxLength={NOTE_MAX + 20}
          style={[styles.input, errors.note ? styles.inputError : null]}
          accessibilityLabel="Nota"
        />
        <View style={styles.helperRow}>
          {errors.note ? <Text style={styles.error}>{errors.note}</Text> : <View />}
          <Text style={[styles.counter, note.trim().length > NOTE_MAX && styles.error]}>
            {note.trim().length}/{NOTE_MAX}
          </Text>
        </View>
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Poder · {rating} de 7 esferas *</Text>
        <SphereRating
          value={rating}
          onChange={(value) => {
            setRating(value);
            if (errors.rating) setErrors((prev) => ({ ...prev, rating: undefined }));
          }}
        />
        {errors.rating ? <Text style={styles.error}>{errors.rating}</Text> : null}
      </View>

      <AppButton label={submitLabel} onPress={handleSubmit} />
    </Panel>
  );
}

const styles = StyleSheet.create({
  form: { gap: Spacing.five, padding: Spacing.four, backgroundColor: Colors.paper },
  field: { gap: Spacing.two },
  label: { fontFamily: Fonts.display, fontSize: 20, letterSpacing: 0.5, color: Colors.maroon },
  input: {
    minHeight: 96,
    backgroundColor: Colors.white,
    borderRadius: Radius.button,
    borderWidth: Ink.border - 1,
    borderColor: Colors.black,
    padding: Spacing.four,
    fontSize: 16,
    color: Colors.black,
    textAlignVertical: 'top',
  },
  inputError: { borderColor: Colors.red },
  helperRow: { flexDirection: 'row', justifyContent: 'space-between', gap: Spacing.two },
  counter: { color: Colors.inkSoft, fontSize: 12, fontWeight: '700' },
  error: { color: Colors.red, fontSize: 13, fontWeight: '700', flexShrink: 1 },
});
